"use strict";

module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define("Like", {
    id: DataTypes.INTEGER, 
    username: DataTypes.STRING, // tykkääjä
    blogid: DataTypes.STRING // blogin id
  }, {
    classMethods: {
      associate: function(models) {
        // Tässä voi assosioida malleja toisiinsa
      }
    }
  });

  return Like;
};