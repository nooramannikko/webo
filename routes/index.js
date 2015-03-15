var express = require('express');
var router = express.Router();

var models = require('../models');

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function(req, res, next) {
  models.User.findAll().then(function(users) {
    res.render('index', {
      host: req.headers.host,
      users: users
    });
  });
});

passport.use(new BasicStrategy(
  function(username, password, done) {
    models.User.find( { where: {username: username}} )
      .success(function(user){
      
        // if the user does not exist
        if(!user)
          return done(null, false);
        // if the password does not match
        else if(password !== user.password)
          return done(null, false);
        // if everything is OK, return null as the error
        // and the authenticated user
        else
          return done(null, user);
        
      })
      // if command executed with error
      .error(function(err){
        return done(err);
      });
  }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (user, done) {
    models.User.find( { where: {username: user.username}}, function (err, user) {
        done(err, user);
    });
});

router.get('/login',
  passport.authenticate('basic', { session: true }),
  function(req, res){
    res.json({ username: req.user.username, name: req.user.name });
  });

router.get('/api/ht', function(req, res, next) {
  res.json({ group: 'nununu' });
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
