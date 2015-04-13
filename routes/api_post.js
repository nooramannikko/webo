var express = require('express');
var router = express.Router();

var models = require('../models');

// Hae blogikirjoituksen tiedot
router.get('/:id', function(req, res, next) {

	var id = req.params['id'];
	var query = {where: {id: id}};
	models.Post.findOne(query).then(function(post) {
		if (post) {
			return res.status(200).json({
				title: post.title, 
				text: post.text, 
				author: post.author, 
				likes: post.likes // TODO: Hae määrä tietokannasta
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

module.exports = router;