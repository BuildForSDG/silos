import sequelize from '../config/sequelize';

const Product = sequelize.import('../models/products');

const productsCount = async () => {
  const count = await Product.count();
  return count;
};

export default { productsCount };
