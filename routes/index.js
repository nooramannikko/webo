var express = require('express');
var router = express.Router();

var models = require('../models');

var passport = require('passport');
var BasicStrategy = require('passport-http').Strategy;

router.get('/', function(req, res, next) {
  models.User.findAll().then(function(users) {
    res.render('index', {
      host: req.headers.host,
      users: users
    });
  });
});

/*router.post('/login', function(req, res, next) {
	var username = req.body.username;
	var query = {where: {username: username}};
	// Etsi käyttäjä tunnuksella
  	models.User.findOne(query).then(function(user) {
  		if (user) {
  			// Tarkista salasana
  			var password = req.body.password;
  			if (password === user.password) {
  				// Tallenna kirjautuminen
  				// Väliaikainen ratkaisu:
  				return res.status(200).json();
  			}
  			else {
  				return res.status(404).json({error: 'InvalidPassword'});
  			}
  		}
  		else {
  			return res.status(404).json({error: 'UserNotFound'});
  		}
  	});
});*/

module.exports = router;
