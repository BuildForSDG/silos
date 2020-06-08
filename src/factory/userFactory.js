import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelize from '../config/sequelize';

const User = sequelize.import('../models/users');

const createUser = async (userDetails) => {
  const details = userDetails;

  // create the hashed password
  const hashed = await bcrypt.hash(details.password, 10);
  details.password = hashed;

  // create the user
  return sequelize
    .sync()
    .then(() => User.build(userDetails)
      .save()
      .then((user) => user.dataValues))
    .catch((err) => {
      throw err;
    });
};

const userCount = async () => {
  const count = await User.count();
  return count;
};

const generateUserToken = async (user) => {
  const { id, email } = user;

  const token = await jwt.sign(
    {
      email,
      id
    },
    process.env.JWT_KEY,
    {
      expiresIn: '24hr'
    }
  );

  return token;
};

export default { createUser, userCount, generateUserToken };
