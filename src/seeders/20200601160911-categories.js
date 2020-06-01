
/* eslint-disable implicit-arrow-linebreak */
module.exports = {
  up: (queryInterface, Sequelize) => // eslint-disable-line no-unused-vars
    queryInterface.bulkInsert('categories', [{
      name: 'food',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'live stock',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'poultry',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'fish and seafood',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'vegetables',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'fruits',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'grains',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'milk',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('categories', null, {}) // eslint-disable-line no-unused-vars
};
