var express = require('express');
var router = express.Router();

var models = require('../models');


router.post('/', function(req, res, next) {

  var username = req.body.username;
  var usernameRegex = /^([a-z][a-z0-9_]*)$/.test(username);
  var name = req.body.name;
  var password = req.body.password;
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
      username: username,
      name: name,
      password: password // salasanan piilottaminen pyynnössä?
      }).then(function(user) {
        // vastaukseen ei speksattu käyttäjän tietoja
        return res.status(201).json(); 
      },
      function(err) {
        return res.status(500).json({error: 'ServerError'});
      });
    }
  });
 
});

router.get('/:username', function(req, res, next) {

  // TODO : 
  // Pyyntö pitää saada tehtyä formista osoitteeseen /:username eikä ?username=:username
  // Toimii, jos manuaalisesti kirjottaa osoiterivile oikean urlin

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

module.exports = router;
