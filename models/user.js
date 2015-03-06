"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
        // http://sequelize.readthedocs.org/en/latest/docs/associations/
        //
        // Tyyliin
        // User.hasMany(models.BlogPost);
      }
    }
  });

  return User;
};
