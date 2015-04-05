var express = require('express');
var router = express.Router();

var models = require('../models');

var crypto = require('crypto');

var uID = 1; // user id


router.post('/', function(req, res, next) {

  var username = req.body.username;
  var usernameRegex = /^([a-z][a-z0-9_]*)$/.test(username);
  var name = req.body.name;
  var sha256 = crypto.createHash('sha256');
  var password = sha256.update(req.body.password).digest('base64');
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

module.exports = router;
