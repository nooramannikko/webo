var express = require('express');
var router = express.Router();

var models = require('../models');

var sequelize = require('../node_modules/sequelize');

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
    if (blog) {
      bID += 1;
      newBlog = blog;
      blog.addAuthor(user.id).then(function() {
        return res.status(201).json({id: blog.id});
      }, 
      function(err) {
        return res.status(500).json({error: err});
      });
    }
    else {
      return res.status(500).json({error: 'ServerError'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: err});
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

  var currentUser = req.user;

  var query = {where: {id: blogid}};
  var blogToDelete;
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista, että käyttäjällä on oikeus blogiin
      var isAuthorized = false;
      var numAuthor = 0;
      var authorNames = currentUser.username;
      blog.getAuthors({where: {username: currentUser.username}}).then(function(authors) {
        if (authors) {
          isAuthorized = true;
          //return res.status(401).json({error: 'Authors ' + isAuthorized});
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
                return res.status(500).json({error: err});
              });
            }, 
            function(err) {
              return res.status(500).json({error: err});
            }); 
          }
          else {
            return res.status(403).json({error: 'CannotDeleteDefaultBlog'});
          }
        }
        else {
          return res.status(500).json({error: 'NoAuthors'});
        }
      }, 
      function(err) {
        return res.status(500).json({error: err});
      });
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });
});

router.put('/:id/author/:username', function(req, res, next) {

  var username = req.params['username'];
  var id = req.params['id'];
  var user = req.user;

  var query = {where: {id: id}};
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista, että nykyisellä käyttäjällä on kirjoitusoikeus tähän blogiin
      blog.getAuthors({where: {username: user.username}}).then(function(authors){
        if (authors) {
          //Tarkista, ettei oletusblogi
          if (!/^([0-9]*)$/.test(id)) {
            return res.status(403).json({error: 'CannotModifyDefaultBlog'});
          }
          models.User.findOne({where: {username: username}}).then(function(usr) {
            if (usr) {
              blog.addAuthor(usr.id).then(function() {
                return res.status(200).json();
              }, 
              function(err) { 
                return res.status(500).json({error: err});
              });
            }
            else {
              return res.status(404).json({error: 'UserNotFound'});
            }
          }, 
          function(err) {
            return res.status(500).json({error: err});
          });
        }
        else {
          return res.status(401).json({error: 'Unauthorized'});
        }
      }, 
      function(err) {
        return res.status(500).json({error: err});
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
  var user = req.user;

  var query = {where: {id: id}};
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista, että nykyisellä käyttäjällä on kirjoitusoikeus tähän blogiin
      blog.getAuthors({where: {username: user.username}}).then(function(authors) {
        if (authors) {
          // Tarkista, ettei oletusblogi
          if (!/^([0-9]*)$/.test(id)) {
            return res.status(403).json({error: 'CannotDeleteDefaultBlog'});
          }
          models.User.findOne({where: {username: username}}).then(function(usr) {
            if (usr) {
              blog.removeAuthor(usr.id).then(function() {
                return res.status(200).json();
              }, 
              function(err) {
                return res.status(500).json({error: err});
              });
            }
            else {
              return res.status(404).json({error: 'UserNotFound'});
            }
          }, 
          function(err) {
            return res.status(500).json({error: err});
          });
        }
        else {
          return res.status(401).json({error: 'Unauthorized'});
        }
      }, 
      function(err) {
        return res.status(500).json({error: err});
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
            if (post) {
              pID += 1;
              // Luo yhteydet
              blog.addBlogPost(post).then(function() {
                user.addAuthoredPost(post).then(function() {
                  return res.status(201).json({id: post.id});
                }, 
                function(err) {
                  return res.status(500).json({error: '1' + err}); // Numerot testausta varten
                });
              }, 
              function(err) {
                return res.status(500).json({error: '2' + err});
              });
            }
            else {
              return res.status(500).json({error: 'ServerError'});
            }
          }, 
          function(err) {
            return res.status(500).json({error: 'ServerError'});
          });
        }
        else {
          return res.status(401).json({error: 'Unauthorized'});
        }
      }, 
      function(err) {
        return res.status(500).json({error: '3' + err});
      }); 
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: '4' + err});
  });
});

router.get('/:id/posts', function(req, res, next) {

  var id = req.params['id'];
  models.Blog.findOne({where: {id: id}}).then(function(blog) {
    if (blog) {
      // Hae 10 uusinta viestiä
      blog.getBlogPosts({limit: 10, order: 'createdAt DESC'}).then(function(posts) {
        var data = [];
        for (var i = posts.length-1; i >= 0; i--) {
          data.push({
            id: posts[i].id, 
            title: posts[i].title, 
            text: posts[i].text, 
            author: posts[i].author
          });
        }
        return res.status(200).json(data);
      }, 
      function(err) {
        return res.status(500).json({error: err});
      });
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: err});
  });

});

module.exports = router;
