"use strict";

module.exports = function(sequelize, DataTypes) {
  var Blog = sequelize.define("Blog", {
    id: DataTypes.STRING, 
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
        Blog.belongsToMany(models.User, {
          as: 'Authors', 
          through: 'BlogAuthors', 
          constraints: false
        });
        Blog.hasMany(models.Post, {as: 'BlogPosts'});
      }
    }
  });

  return Blog;
};
