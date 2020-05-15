
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
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
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users') // eslint-disable-line no-unused-vars
};
