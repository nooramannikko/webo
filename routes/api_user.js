var express = require('express');
var router = express.Router();

var models = require('../models');


router.post('/', function(req, res, next) {

  // Pitää vielä tarkistaa, onko username jo jollain muulla
  // ja onko usernamessa vain sallittuja merkkejä

  var username = req.body.username;
  var name = req.body.name;
  var password = req.body.password;
  if (!username || !name || !password) {
    return res.status(400).json({error: 'InvalidUserName'});
  }
  models.User.create({
    username: username,
    name: name,
    password: password
  }).then(function(user) {
    return res.status(201).json(user);
  },
  function(err) {
    return res.status(500).json({error: 'ServerError'});
  });
});


router.get('/:username', function(req, res, next) {

  // TODO : ei toimi

  var username = req.params['username'];
  var query = {where: {username: username}};
  models.User.findOne(query).then(function(user) {
    if (user) {
      return res.json(user);
    }
    else {
      return res.status(404).json({error: 'UserNotFound'});
    }
  });
});

module.exports = router;
