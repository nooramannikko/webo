var express = require('express');
var router = express.Router();

var models = require('../models');

var cID = 1; // ID kommenteille

// Hae blogikirjoituksen tiedot
router.get('/:id', function(req, res, next) {

	var id = req.params['id'];
	var query = {where: {id: id}};
	models.Post.findOne(query).then(function(post) {
		if (post) {
			post.getPostLikes().then(function(likes) {
				return res.status(200).json({
					title: post.title, 
					text: post.text, 
					author: post.author, 
					likes: likes.length
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
});


// Hakee 10 uusinta blogikirjoituksen kommenttia
router.get('/:id/comments', function(req, res, next) {

	var id = req.params['id'];
  models.Post.findOne({where: {id: id}}).then(function(post) {
    if (post) {
      // Hae 10 uusinta viestiä
      post.getPostComments({limit: 10, order: 'createdAt DESC'}).then(function(posts) {
        var data = [];
        for (var i = posts.length-1; i >= 0; i--) {
          data.push({
            id: posts[i].id, 
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
      return res.status(404).json({error: 'BlogPostNotFound'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: err});
  });
});


// Lisää uuden kommentin blogikirjoitukseen
router.post('/:id/comments', function(req, res, next) {

	var id = req.params['id'];
  var text = req.body.text;
  
  if (!text) {
    return res.status(400).json({error: 'MissingText'});
  }

  var user = req.user;
  var query = {where: {id: id}};
  models.Post.findOne(query).then(function(post) {
    if (post) {
      // Luo viesti
      models.Comment.create({
      	id: cID, 
      	text: text,
      	author: user.username, 
        blogid: post.blogid
      }).then(function(comment) {
        if (comment) {
          cID += 1;
          // Luo yhteydet
          post.addPostComment(comment).then(function() {
            return res.status(201).json({id: comment.id});
            /*models.User.findOne({where: {id: user.id}}).then(function(author) {
          	  author.addAuthoredComment(comment).then(function() {
            	  return res.status(201).json({id: comment.id});
          	  }, 
        	    function(err) {
          	    return res.status(500).json({error: '1' + err}); // Numerot testausta varten
          	  });
            },
            function(err) {
              return res.status(500).json({error: '2' + err});
            });*/
      	  }, 
          function(err) {
            return res.status(500).json({error: '3' + err});
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
      return res.status(404).json({error: 'BlogPostNotFound'});
    }
  }, 
  function(err) {
    return res.status(500).json({error: '4' + err});
  });
});

module.exports = router;