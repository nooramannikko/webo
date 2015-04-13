"use strict";

module.exports = function(sequelize, DataTypes) {
  var Follow = sequelize.define("Follow", {
    username: DataTypes.STRING, // seuraaja
    id: DataTypes.INTEGER // blogin id
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
      }
    }
  });

  return Follow;
};