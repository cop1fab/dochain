'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
    nationality: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  user.associate = function (models) {
    // associations can be defined here
  };
  return user;
};