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
  req.logout();
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}


router.get('/', function(req, res, next) {
  models.User.findAll().then(function(users) {
    res.render('index', {
      host: req.headers.host,
      users: users
    });
  });
});

router.get('/api/ht', function(req, res, next) {
  res.json({ group: 'nununu' });
});

router.post('/logout', logout);

router.post('/login', 
  passport.authenticate('local'),
  function(req, res) {
    models.User.findAll().then(function(users) {
    res.render('index', {
      host: req.headers.host,
      users: users
    });
  });
});

router.post('/api/blog*',apiAuth);
router.put('/api/user/:username',passport.authenticate('basic'));
router.delete('/api/blog/:id',apiAuth);
/*router.get('/api/user/getuser',apiAuth);*/
router.use('/api/blog/:id/author/:username',passport.authenticate('basic'));
router.use('/api/blog/:id/posts',passport.authenticate('basic'));
router.post('/api/post/:id/comments',passport.authenticate('basic'));
router.use('/api/user/:username/follows/:id',passport.authenticate('basic'));
router.use('/api/user/:username/likes/:id',passport.authenticate('basic'));

module.exports = router;
