var express = require('express');
var router = express.Router();

var models = require('../models');

var crypto = require('crypto');

var uID = 1; // user id
var fID = 1; // seuraamisen id
var lID = 1; // tykkäämisen id


// Luo käyttäjä
router.post('/', function(req, res, next) {

  try {
    var username = req.body.username;
    var usernameRegex = /^([a-z][a-z0-9_]*)$/.test(username);
    var name = req.body.name;
    var sha256 = crypto.createHash('sha256');
    var password = sha256.update(req.body.password).digest('base64');
  } catch (err) {
    return res.status(400).json({error: 'InvalidFields'});
  }

  if (!username || !usernameRegex) {
    return res.status(400).json({error: 'InvalidUserName'});
  }
  if (!name) {
    return res.status(400).json({error: 'NameEmpty'});
  }
  if (!password) {
    return res.status(400).json({error: 'PasswordEmpty'});
  }

  var query = {where: {username: username}};
  models.User.findOne(query).then(function(user) {
    if (user) {
      return res.status(409).json({error: 'UserNameAlreadyInUse'});
    }
    else {
      models.User.create({
      id: uID, 
      username: username,
      name: name,
      password: password // salasanan piilottaminen pyynnössä?
      }).then(function(user) {
        uID += 1;
        // Luodaan oletusblogi
        models.Blog.create({
          id: user.username, 
          name: 'Oletusblogi'
        }).then(function(blog) {
          return blog.addAuthor(user);
        }).then(function() {
          return res.status(201).json(); 
        });
      }, 
      function(err) {
        return res.status(500).json({error: 'ServerError'});
      });
    }
  });
 
});

// Hae käyttäjän tiedot
router.get('/:username', function(req, res, next) {

  var username = req.params['username'];
  var query = {where: {username: username}};
  models.User.findOne(query).then(function(user) {
    if (user) {
      // ei palauteta salasanaa
      return res.status(200).json({username: user.username, name: user.name});
    }
    else {
      return res.status(404).json({error: 'UserNotFound'});
    }
  });
});

// Päivitä käyttäjän tiedot
router.put('/:username', function(req, res, next) {

  var name = req.body.name;
  var password = req.body.password;
  var username = req.params['username'];

  if (username !== req.user.username) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  // Ei tiedetä, onko arvo tyhjä tarkoituksella, joten lasketaan virheeksi
  if (!name && !password) {
    return res.status(400).json({error: 'NotGivenNewInformation'});
  }

  var sha256 = crypto.createHash('sha256');
  var query = {where: {username: username}}; 
  models.User.findOne(query).then(function(user) {
    if (user) {
      // Molemmat tiedot päivitettävä
      if(!password) {
        user.updateAttributes({ 
          name: name
        }).then(function() {
         return res.status(200).json();
        }), function(err) {
         return res.status(500).json({error: 'ServerError'});
        };
      }
      else if(!name) {
        user.updateAttributes({ 
          password: sha256.update(password).digest('base64')
        }).then(function() {
          return res.status(200).json();
        }), function(err) {
          return res.status(500).json({error: 'ServerError'});
        };
      }
      else {
        user.updateAttributes({ 
          name: name, 
          password: sha256.update(password).digest('base64')
        }).then(function() {
          return res.status(200).json();
        }), function(err) {
          return res.status(500).json({error: 'ServerError'});
        };
      }
    }
    else {
      return res.status(404).json({error: 'UserNotFound'});
    }
  });

});

// Hae käyttäjän blogit
router.get('/:username/blogs', function(req, res, next) {
  
  var username = req.params['username'];
  var query = {where: {username: username}};
  var userID;
  models.User.findOne(query).then(function(user) {
    if (user) {
      userID = user.id;
      user.getAuthoredBlogs().then(function(blogs) {
        var data = [];
        for (var i = 0; i < blogs.length; i++){
          data.push({ id: blogs[i].id });
        }
        return res.status(200).json(data);
      });
    }
    else {
      return res.status(404).json({error: 'UserNotFound'});
    }
  });
});

// Lisää tykkäys
router.put('/:username/likes/:id', function(req, res, next) {

  var username = req.params['username'];
  var id = req.params['id'];
  var currentUser = req.user;

  models.User.findOne({where: {username: username}}).then(function(user) {
    if (user) {
      // Tarkista, että annettu käyttäjä on nykyinen käyttäjä
      if (currentUser.username !== username) {
        return res.status(403).json({error: 'Forbidden'});
      }
      // Tarkista, onko käyttäjä jo tykännyt viestistä
      models.Like.findOne({where: {username: username, postid: id}}).then(function(like) {
        if (like) {
          // On jo, ei luoda uutta
          return res.status(200).json();
        }
        else {
          models.Post.findOne({where: {id: id}}).then(function(post) {
            if (post) {
              // Luo tykkäysobjekti
              models.Like.create({
                id: lID, 
                username: username, 
                blog: post.blogid
              }).then(function(like) {
                lID += 1;
                // Lisää tykkkäys blogikirjoitukseen
                post.addPostLike(like).then(function() {
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
              return res.status(404).json({error: 'PostNotFound'});
            }
          }, 
          function(err) {
            return res.status(500).json({error: err});
          });
        }
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

});

// Poista tykkäys
router.delete('/:username/likes/:id', function(req, res, next) {

  var username = req.params['username'];
  var id = req.params['id'];
  var currentUser = req.user;

  models.User.findOne({where: {username: username}}).then(function(user) {
    if (user) {
      // Tarkista, että annettu käyttäjä on nykyinen käyttäjä
      if (currentUser.username !== username) {
        return res.status(403).json({error: 'Forbidden'});
      }

      models.Post.findOne({where: {id: id}}).then(function(post) {
        if (post) {
          // Etsi tykkäysobjekti
          var query = {where: {username: username, id: post.id}};
          models.Like.findOne(query).then(function(like) {
            if (like) {
              // Poista tykkäys kirjoituksesta
              post.removePostLike(like).then(function() {
                // Poista tykkäysobjekti
                like.destroy().then(function() {
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
              return res.status(500).json({error: 'ServerError'});
            }
          }, 
          function(err) {
            return res.status(500).json({error: err});
          });
        }
        else {
          return res.status(404).json({error: 'PostNotFound'});
        }
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
});

// Seuraa blogia
router.put('/:username/follows/:id', function(req, res, next) {

  var username = req.params['username'];
  var id = req.params['id'];
  var currentUser = req.user;

  models.User.findOne({where: {username: username}}).then(function(user) {
    if (user) {
      // Tarkista, että annettu käyttäjä on nykyinen käyttäjä
      if (currentUser.username !== username) {
        return res.status(403).json({error: 'Forbidden'});
      }
      models.Blog.findOne({where: {id: id}}).then(function(blog) {
        if (blog) {
          // Luo seuraamisobjekti
          models.Follow.create({
            id: fID, 
            username: username,
            blog_id: id
          }).then(function(follow) {
            fID += 1;
            if (follow) {
              // Luo yhteys
              blog.addBlogFollower(follow).then(function() {
                return res.status(200).json();
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
        }
        else {
          return res.status(404).json({error: 'BlogNotFound'});
        }
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
});

// Peru blogin seuraaminen
router.delete('/:username/follows/:id', function(req, res, next) {

  var username = req.params['username'];
  var id = req.params['id'];
  var currentUser = req.user;

  models.User.findOne({where: {username: username}}).then(function(user) {
    if (user) {
      // Tarkista, että annettu käyttäjä on nykyinen käyttäjä
      if (currentUser.username !== username) {
        return res.status(403).json({error: 'Forbidden'});
      }
      models.Blog.findOne({where: {id: id}}).then(function(blog) {
        if (blog) {
          // Etsi tykkäysobjekti
          var query = {where: {username: username, id: blog.id}};
          models.Follow.findOne(query).then(function(follow) {
            if (follow) {
              // Poista seuraaminen blogista
              blog.removeBlogFollower(follow).then(function() {
                // Poista tykkäysobjekti
                follow.destroy().then(function() {
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
              return res.status(500).json({error: 'ServerError'});
            }
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
    }
    else {
      return res.status(404).json({error: 'UserNotFound'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: err});
  });
});

// Hae käyttäjän seuraamat blogit
router.get('/:username/follows', function(req, res, next) {

  var username = req.params['username'];

  models.User.findOne({where: {username: username}}).then(function(user) {
    if (user) {
      models.Follow.findAll({where: {username: username}}).then(function(follows) {
        if (follows) {
          // Hae blogit seuraamisien perusteella
          var blogIDs = [];
          for (var i = 0; i < follows.length; i++) {
            blogIDs.push(follows[i].blog_id);
          }
          models.Blog.findAll({where: {id: blogIDs}}).then(function(blogs) {
            if (blogs) {
              var data = [];
              for (var i = 0; i < blogs.length; i++) {
                data.push({id: blogs[i].id});
              }
              return res.status(200).json(data);
            }
            else
              return res.status(200).json([]);
          }, 
          function(err) {
            return res.status(500).json({error: err});
          });
        }
        else
          return res.status(200).json([]);
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
});


module.exports = router;