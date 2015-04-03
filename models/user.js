"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
        User.belongsToMany(models.Blog, {as: 'AuthoredBlogs', through: 'BlogAuthors'});
        //User.hasMany(models.Post, {as: 'AuthoredPosts'});
      }
    }
  });

  return User;
};
