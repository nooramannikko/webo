var express = require('express');
var router = express.Router();

var models = require('../models');

var bID = 1; // IDt blogeille


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
    return blog.addAuthor(user.id);
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

  var query = {where: {id: blogid}};
  var blogToDelete;
  models.Blog.findOne(query).then(function(blog) {
    if (blog) {
      // Tarkista id:stä, ettei ole oletusblogi
      if (/^([0-9]*)$/.test(blog.id)) {
        blogToDelete = blog;
        // poista riippuvuudet
        blog.setAuthors([]).then(function() {
          blogToDelete.destroy().then(function() {
            return res.status(200).json();
          }, 
          function(err) {
            return res.status(500).json({error: 'ServerError'});
          });
        }, 
        function(err) {
          return res.status(500).json({error: 'ServerError'});
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

module.exports = router;
