'use strict';
export default (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  Test.associate = function(models) {
    // associations can be defined here
  };
  return Test;
};