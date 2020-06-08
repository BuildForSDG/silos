/* eslint-disable import/no-extraneous-dependencies */
import Chance from 'chance';
import sequelize from '../config/sequelize';

const chance = new Chance();
const Product = sequelize.import('../models/products');

const createMany = async (number) => {
  const createdProducts = [];

  const productDetails = {
    userId: 1,
    productName: 'Parboiled Rice',
    description: chance.word(),
    availableQuantity: 20,
    categoryId: 1,
    price: 5000,
    unit: 5
  };

  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < number; index += 1) {
    const product = await Product.build(productDetails).save();
    const created = product.dataValues;
    createdProducts.push(created);
  }
  return createdProducts;
};

const create = async () => {
  const productDetails = {
    userId: 1,
    productName: 'Parboiled Rice',
    description: chance.word(),
    availableQuantity: 20,
    categoryId: 1,
    price: 5000,
    unit: 5
  };

  const product = await Product.build(productDetails).save();
  return product.dataValues;
};

const createForUser = async (userId, number) => {
  const createdProducts = [];

  const productDetails = {
    userId,
    productName: 'Vgetables',
    description: chance.word(),
    availableQuantity: 20,
    categoryId: 1,
    price: 5000,
    unit: 5
  };

  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < number; index += 1) {
    const product = await Product.build(productDetails).save();
    const created = product.dataValues;
    createdProducts.push(created);
  }
  return createdProducts;
};

const totalUsersProduct = async (userId) => {
  const products = await Product.count({ where: { userId } });

  return products;
};

const productsCount = async () => {
  const count = await Product.count();
  return count;
};

export default {
  productsCount, create, createMany, createForUser, totalUsersProduct
};
