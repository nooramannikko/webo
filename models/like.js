"use strict";

module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define("Like", {
    username: DataTypes.STRING, // tykkääjä
    id: DataTypes.INTEGER // viestin id
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
      }
    }
  });

  return Like;
};