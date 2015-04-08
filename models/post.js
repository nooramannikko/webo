"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    id: DataTypes.STRING, 
    title: DataTypes.STRING,
    text: DataTypes.STRING, 
    author: DataTypes.STRING, 
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
        Post.hasOne(models.Blog, {as: 'BlogPost'});
        Post.hasOne(models.User, {as: 'Author'});
      }
    }
  });

  return Post;
};