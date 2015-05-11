var express = require('express');
var router = express.Router();

var models = require('../models');
var session = require('express-session');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;

var crypto = require('crypto');

router.use(session({
  secret: 'hyddvitfrtnaooinen',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

var options = {realm: "tamplr"};

passport.use(new BasicStrategy(options, 
  function(username, password, done) {
    models.User.find( { where: {username: username}} )
      .success(function(user){
        if(!user)
          return done(null, false);
        
        else if (crypto.createHash('sha256').update(password).digest('base64') !== user.password)
          return done(null, false);
        
        else
          return done(null, user);
      })
      .error(function(err){
        return done(err);
      });
  }
));

var basicAuth = passport.authenticate('basic', {session: true});

// Tarkista, onko kirjautunut
function apiAuth(req, res, next) {
  if (req.user) {
    // on kirjautunut
    next();
  }
  else {
    basicAuth(req, res, next);
  }
}

// Lomakekirjautuminen
passport.use(new LocalStrategy(options, 
  function(username, password, done) {
    models.User.find( { where: {username: username}} )
      .success(function(user){
        if(!user)
          return done(null, false);
        
        else if (crypto.createHash('sha256').update(password).digest('base64') !== user.password)
          return done(null, false);
        
        else
          return done(null, user);
      })
      .error(function(err){
        return done(err);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Uloskirjaus
function logout(req, res){
  userNowLoggedIn = null;
  req.logout();
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}


router.get('/', function(req, res, next) {
  models.User.findAll().then(function(users) {
    res.render('index', {
      host: req.headers.host,
      users: users,
      user: req.user
    });
  });
});

router.get('/api/ht', function(req, res, next) {
  res.json({ group: 'nununu' });
});

router.post('/logout', logout);

// Käyttäjänimi
var userNowLoggedIn = null;

router.post('/login', 
  passport.authenticate('local'),
  function(req, res) {
    userNowLoggedIn = req.body.username;
    models.User.findAll().then(function(users) {
    res.render('index', {
      host: req.headers.host,
      users: users
    });
  });
});

router.get('/account', function(req, res, next) {
  res.render('account', {host: req.headers.host});
});

router.get('/settings', function(req, res, next) {
  res.render('settings', {host: req.headers.host, user: req.user});
});

router.get('/blog/:id', function(req, res, next) {
  var blogid = req.params['id'];
  var query = { where: { id: blogid } };
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      if (req.user) {
        var followed = 'false'
        var authors = [];
        models.Follow.findOne({where: {blog_id: blogid, username: req.user.username}}).then(function(follow) {
          if (follow) 
            followed = 'true';
          blog.getAuthors({where: {id: req.user.id}}).then(function(a) {
            for(var i = 0; i < a.length; ++i) {
              authors.push(a[i].username);
            }
          
          res.render('blog', {
            host: req.headers.host, 
            id: blog.id, 
            name: blog.name, 
            user: req.user,
            authors: authors,
            followed: followed });

          }, 
          function(err) {
            return res.status(500).json({error: 'GetAuthorNotWorking'});
          });
        }, 
        function(err) {
          return res.status(500).json({error: err});
        });
      }
      else {
        res.render('blog', {
            host: req.headers.host, 
            id: blog.id, 
            name: blog.name, 
            user: req.user,
            authors: authors,
            followed: followed });
      }
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: err});
  });
});

router.get('/post/:id', function(req, res, next) {
  var postid = req.params["id"];
  models.Post.findOne({where: {id: postid}}).then(function(post) {
    if (post) {
      if (req.user) {
        var liked = 'false'
        models.Like.findOne({where: {postid: postid, username: req.user.username}}).then(function(like) {
          if (like) 
            liked = 'true';
          res.render('post', {
            host: req.headers.host,
            id: post.id, 
            title: post.title, 
            text: post.text, 
            author: post.author, 
            blogid: post.blog_id, 
            blogname: post.blogname, 
            liked: liked, 
            user: req.user
          });
        }, 
        function(err) {
          return res.status(500).json({error: err});
        });
      }
      else {
        res.render('post', {
          host: req.headers.host,
          id: post.id, 
          title: post.title, 
          text: post.text, 
          author: post.author, 
          blogid: post.blog_id, 
          blogname: post.blogname, 
          liked: 'false', 
          user: req.user
        });
      }
    }
    else {
      return res.status(404).json({error: 'PostNotFound'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: err});
  });
});

router.get('/api/username', function(req, res, next) {
  if (userNowLoggedIn == null)
    return res.status(401).json();
  return res.status(200).json({username: userNowLoggedIn});
});

router.post('/api/blog*',apiAuth);
router.put('/api/user/:username',apiAuth);
router.delete('/api/blog/:id',apiAuth);
router.use('/api/blog/:id/author/:username',apiAuth);
router.post('/api/blog/:id/posts',apiAuth);
router.post('/api/post/:id/comments',apiAuth);
router.use('/api/user/:username/follows/:id',apiAuth);
router.use('/api/user/:username/likes/:id',apiAuth);

module.exports = router;
