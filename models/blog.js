"use strict";

module.exports = function(sequelize, DataTypes) {
  var Blog = sequelize.define("Blog", {
    id: DataTypes.STRING, 
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
        Blog.belongsToMany(models.User, {as: 'Authors', through: 'BlogAuthors'});
        //Blog.hasMany(models.Post, {as: 'BlogPosts'});
      }
    }
  });

  return Blog;
};
