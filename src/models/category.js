
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  // Category.associate = function(models) {
  //   // associations can be defined here
  // };
  return Category;
};
