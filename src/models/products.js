import Sequelize from 'sequelize';

/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const products = sequelize.define(
    'products',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      availableQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  products.associate = (models) => {
    // associations can be defined here
    products.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  };
  return products;
};
