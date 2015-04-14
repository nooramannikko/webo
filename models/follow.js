"use strict";

module.exports = function(sequelize, DataTypes) {
  var Follow = sequelize.define("Follow", {
    id: DataTypes.INTEGER, 
    username: DataTypes.STRING, // seuraaja
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
      }
    }
  });

  return Follow;
};