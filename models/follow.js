"use strict";

module.exports = function(sequelize, DataTypes) {
  var Follow = sequelize.define("Follow", {
    id: DataTypes.INTEGER, 
    username: DataTypes.STRING, // seuraaja
    blog_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
      }
    }
  });

  return Follow;
};