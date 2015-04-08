"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    id: DataTypes.INTEGER,
    text: DataTypes.STRING, 
    author: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
        Comment.hasOne(models.Post, {as: 'PostComment'});
        Comment.hasOne(models.User, {as: 'Author'});
      }
    }
  });

  return Comment;
};