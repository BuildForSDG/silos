import Sequelize from 'sequelize';

/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userType: {
      type: Sequelize.STRING,
      allowNull: false
    },
    businessName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bio: {
      type: Sequelize.TEXT
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    photo: {
      type: Sequelize.STRING
    }
  });
  // User.associate = function (models) {
  //   // associations can be defined here
  // };
  return User;
};
/* eslint-disable no-unused-vars */
