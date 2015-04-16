var express = require('express');
var router = express.Router();

var models = require('../models');

var sequelize = require('../node_modules/sequelize');

var bID = 1; // IDt blogeille
var pID = 1; // IDt viesteille


// Luo blogi
router.post('/', function(req, res, next) {

  var blogname = req.body.name;
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

// Hae blogin tiedot
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

// Poista blogi
router.delete('/:id', function(req, res, next) {
  
  var blogid = parseInt(req.params['id']);
  if (!blogid) {
    return res.status(404).json({error: 'BlogNotFound'});
  }

  var currentUser = req.user;

  var query = {where: {id: blogid}};
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista, että käyttäjällä on oikeus blogiin
      var isAuthorized = false;
      var numAuthor = 0;
      var authorNames = currentUser.username;
      blog.getAuthors({where: {id: currentUser.id}}).then(function(authors) {
        if (authors) {
          isAuthorized = true;
          // Tarkista id:stä, ettei ole oletusblogi
          if (/^([0-9]*)$/.test(blog.id)) {
            // poista riippuvuudet
            blog.setAuthors([]).then(function() {
              // Poista kommentit 
              models.Comment.destroy({where: {blogid: blog.id}}).then(function() {
                // Poista tykkäykset
                models.Like.destroy({where: {blogid: blog.id}}).then(function() {
                  // Poista viestit
                  models.Post.destroy({where: {blogid: blog.id}}).then(function() {
                    // Poista seuraamiset
                    models.Follow.destroy({where: {blogid: blog.id}}).then(function() {
                      // Poista blogi
                      blog.destroy().then(function() {
                        return res.status(200).json();
                      }, 
                      function(err) {
                        return res.status(500).json({error: 'DeleteBlog'});
                      });
                    }, 
                    function(err) {
                      return res.status(500).json({error: 'DeleteFollor'});
                    });
                  }, 
                  function(err) {
                    return res.status(500).json({error: 'DeletePost'});
                  });
                }, 
                function(err) {
                  return res.status(500).json({error: 'DeleteLike'});
                });
              }, 
              function(err) {
                return res.status(500).json({error: 'DelteComment'});
              });
            }, 
            function(err) {
              return res.status(500).json({error: '2' + err});
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
        return res.status(500).json({error: 'GetAuthorNotWorking'});
      });
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });
});

// Lisää kirjoitusoikeus blogiin
router.put('/:id/author/:username', function(req, res, next) {

  var username = req.params['username'];
  var id = parseInt(req.params['id']);
  var user = req.user;

  var query = {where: {id: id}};
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista, että nykyisellä käyttäjällä on kirjoitusoikeus tähän blogiin
      blog.getAuthors({where: {id: user.id}}).then(function(authors){
        if (authors[0]) {
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
          return res.status(403).json({error: 'Forbidden'});
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

// Poista kirjoitusoikeis blogista
router.delete('/:id/author/:username', function(req, res, next) {

  var username = req.params['username'];
  var id = parseInt(req.params['id']);
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
          return res.status(403).json({error: 'Forbidden'});
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

// Luo blogikirjoitus
router.post('/:id/posts', function(req, res, next) {

  var id = parseInt(req.params['id']);
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
        if (author[0]) {
          // Luo viesti
          models.Post.create({
          id: pID, 
          title: title,
          text: text,
          author: author[0].username
          }).then(function(post) {
            if (post) {
              pID += 1;
              // Luo yhteydet
              blog.addBlogPost(post).then(function() {
                return res.status(201).json({id: post.id});
                /*author[0].addAuthoredPost(post).then(function() {
                  return res.status(201).json({id: post.id});
                }, 
                function(err) {
                  return res.status(500).json({error: '1' + err}); // Numerot testausta varten
                });*/
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
          return res.status(403).json({error: 'Forbidden'});
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

// Hae blogin viestit
router.get('/:id/posts', function(req, res, next) {

  var id = parseInt(req.params['id']);
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

// Hae blogin seuraajat
router.get('/:id/followers', function(req, res, next) {

  var id = parseInt(req.params['id']);

  models.Blog.findOne({where: {id: id}}).then(function(blog) {
    if (blog) {
      blog.getBlogFollowers().then(function(followers) {
        var data = [];
        for (var i = 0; i < followers.length; i++) {
          data.push({username: followers[i].username});
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
