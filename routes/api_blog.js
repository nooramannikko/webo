var express = require('express');
var router = express.Router();

var models = require('../models');

var bID = 1; // IDt blogeille
var pID = 1; // IDt viesteille


router.post('/', function(req, res, next) {

  var blogname = req.body.blogname;
  if (!blogname) {
    return res.status(400).json({error: 'MissingBlogName'});
  }
  
  var user = req.user;
  var newBlog;
  models.Blog.create({
  id: bID, 
  name: blogname
  }).then(function(blog) {
    bID += 1;
    newBlog = blog;
    return blog.addAuthor(user);
  }, 
  function(err) {
    return res.status(500).json({error: 'ServerError'});
  }).then(function() {
    return res.status(201).json({id: newBlog.id});
  });
 
});

router.get('/:id', function(req, res, next) {

  var blogid = req.params['id'];
  var query = { where: { id: blogid } };
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      return res.status(200).json({id: blog.id, name: blog.name});
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });
});

router.delete('/:id', function(req, res, next) {
  
  var blogid = req.params['id'];
  if (!blogid) {
    return res.status(404).json({error: 'BlogNotFound'});
  }

  // Hae nykyinen käyttäjä ja käyttäjän blogit
  var authoredBlogs = [];
  var currentUser = req.user;
  var foundUser = false;
  var foundBlogs = false;
  // Erinäiset yritelmät varmistaa käyttäjän käytöoikeus ko. blogiin kommentoitu pois.

  // HAKU TUOTTAA 0 BLOGIA, VAIKKA OIKEASTI NIITÄ ON JA TOIMII TIEDOSTOSSA api_user.js
  /*models.User.findOne({where: {username: currentUser.username}}).then(function(user) {
    if (user) {
      foundUser = user.id;
      currentUser = user;
      user.getAuthoredBlogs().then(function(blogs) {
        foundBlogs = blogs.length;
        for (var i = 0; i < blogs.length; i++) {
          authoredBlogs.push(blogs[i].id);
        };
      });
    }
  });*/

  var query = {where: {id: blogid}};
  var blogToDelete;
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista, että käyttäjällä on oikeus blogiin
      // HAKU TUOTTAA TÄSSÄKIN 0 TULOSTA
      /*var isAuthorized = false;
      for (var j = 0; j < authoredBlogs.length; j++) {
        if (blog.id == authoredBlogs[j]) {
          isAuthorized = true;
          break;
        }
      }
      var foundAuthors = false;
      blog.getAuthors().then(function(authors) {
        foundAuthors = authors.length;
        for (var j = 0; j < authors.length; j++) {
          if (authors[j].id == foundUser) {
            isAuthorized;
            break;
          }
        }
      })
      blog.getAuthors({where: {id: currentUser.id}}).then(function(author) {
        if (author) {
          isAuthorized = true;
        }
      });
      if (!isAuthorized) {
        return res.status(401).json({error: 'Unauthorized ' + blog.id + ' ' + foundUser + ' ' + foundAuthors});
      }*/

      // Tarkista id:stä, ettei ole oletusblogi
      if (/^([0-9]*)$/.test(blog.id)) {
        blogToDelete = blog;
        // poista riippuvuudet
        // TODO: Huomioi viestien poisto myös
        blog.setAuthors([]).then(function() {
          blogToDelete.destroy().then(function() {
            return res.status(200).json();
          }, 
          function(err) {
            return res.status(500).json({error: 'ServerError: Failed to destroy'});
          });
        }, 
        function(err) {
          return res.status(500).json({error: 'ServerError: Failed to reset dependencies'});
        }); 
      }
      else {
        return res.status(403).json({error: 'CannotDeleteDefaultBlog'});
      }
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });
});

router.put('/:id/author/:username', function(req, res, next) {

  var username = req.params['username'];
  var id = req.params['id'];

  var query = {where: {id: id}};
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // TODO: Tarkista, että nykyisellä käyttäjällä on kirjoitusoikeus tähän blogiin

      // Tarkista, ettei oletusblogi
      if (!/^([0-9]*)$/.test(id)) {
        return res.status(403).json({error: 'CannotModifyDefaultBlog'});
      }

      models.User.findOne({where: {username: username}}).then(function(user) {
        if (user) {
          blog.addAuthor(user);
          return res.status(200).json();
        }
        else {
          return res.status(404).json({error: 'UserNotFound'});
        }
      });
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });

});

router.delete('/:id/author/:username', function(req, res, next) {

  var username = req.params['username'];
  var id = req.params['id'];

  var query = {where: {id: id}};
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // TODO: Tarkista, että nykyisellä käyttäjällä on kirjoitusoikeus tähän blogiin

      // Tarkista, ettei oletusblogi
      if (!/^([0-9]*)$/.test(id)) {
        return res.status(403).json({error: 'CannotModifyDefaultBlog'});
      }

      models.User.findOne({where: {username: username}}).then(function(user) {
        if (user) {
          blog.removeAuthor(user);
          return res.status(200).json();
        }
        else {
          return res.status(404).json({error: 'UserNotFound'});
        }
      });
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });

});

router.post('/:id/posts', function(req, res, next) {

  var id = req.params['id'];
  var title = req.body.title;
  var text = req.body.text;
  if (!title) {
    return res.status(400).json({error: 'MissingTitle'});
  }
  if (!text) {
    return res.status(400).json({error: 'MissingText'});
  }

  var user = req.user;
  var query = {where: {id: id}};
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista, että käyttäjällä on blogiin kirjoitusoikeus
      blog.getAuthors({where: {id: user.id}}).then(function(author) {
        if (author) {
          // Luo viesti
          models.Post.create({
          id: pID, 
          title: title,
          text: text,
          author: user.username,
          likes: 0
          }).then(function(post) {
            pID += 1;
            // Luo yhteydet
            user.addAuthoredPost(post);
            blog.addBlogPost(post);
            return res.status(201).json({id: post.id});
          }, 
          function(err) {
            return res.status(500).json({error: 'ServerError'});
          });
        }
        else {
          return res.status(401).json({error: 'Unauthorized'});
        }
      }); 
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });
});

router.get('/:id/posts', function(req, res, next) {

  var id = req.params['id'];
  models.Blog.findOne({where: {id: id}}).then(function(blog) {
    if (blog) {
      // Hae 10 uusinta viestiä
      blog.getBlogPosts({limit: 10, order: 'createdAt DESC'}).then(function(posts) {
        var data = []
        for (var i = posts.length-1; i >= 0; i--) {
          data.push({
            id: posts[i].id, 
            title: posts[i].title, 
            text: posts[i].text, 
            author: posts[i].author
          });
        }
      });
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });

})

module.exports = router;
