"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    id: DataTypes.INTEGER, 
    title: DataTypes.STRING,
    text: DataTypes.STRING, 
    author: DataTypes.STRING, 
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
        //Post.hasOne(models.Blog, {as: 'Blog'});
        Post.belongsTo(models.User, {
          as: 'Author'
        });
        Post.hasMany(models.Comment, {
          as: 'PostComments',
          onDelete: 'cascade',
          hooks: true
        });
        Post.hasMany(models.Like, {
          as: 'PostLikes', 
          onDelete: 'cascade', 
          hooks: true
        });
      }
    }
  });

  return Post;
};