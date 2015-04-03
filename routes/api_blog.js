var express = require('express');
var router = express.Router();

var models = require('../models');

var bID = 1; // IDt blogeille


router.post('/', function(req, res, next) {

  var blogname = req.body.name;
  if (!blogname) {
    return res.status(400).json({error: 'MissingBlogName'});
  }
  // Hae käyttäjä
  apiAuth(req, res, function() {
    var user = req.user;
    models.Blog.create({
    name: blogname, 
    id: bID
    }).then(function(blog) {
      bID += 1;
      //blog.addAuthor(user);
      //user.addAuthoredBlogs(blog);
      return res.status(201).json({id: blog.id}); 
    },
    function(err) {
      return res.status(500).json({error: 'ServerError'});
    });
  });

  /*models.Blog.create({
  id: bID, 
  name: blogname
  }).then(function(blog) {
    bID += 1;
    return res.status(201).json({id: blog.id});
  }, 
  function(err) {
    return res.status(500).json({error: 'ServerError'});
  });*/
 
});

router.get('/:id', function(req, res, next) {

  var blogid = req.params['id'];
  var query = {where: {id: id}};
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
  if (!id) {
    return res.status(404).json({error: 'BlogNotFound'});
  }

  var query = {where: {id: id}};
  var blogToDelete;
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista id:stä, ettei ole oletusblogi
      if (/^([0-9]*)$/.test(blog.id)) {
        blogToDelete = blog;
        return blog.setAuthors([]); // poista riippuvuudet
      }
      else {
        return res.status(403).json({error: 'CannotDeleteDefaultBlog'});
      }
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  }).then(function() {
    return blogToDelete.destroy();
  }).then(function(blog) {
    if (blog) {
      return res.status(200).json();
    }
    else {
      return res.status(404).json({error: 'BlogNotFound'});
    }
  });
});

module.exports = router;
