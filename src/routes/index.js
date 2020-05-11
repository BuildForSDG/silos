import express from 'express';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import sequelize from '../config/sequelize';

const router = express.Router();
const User = sequelize.import('../models/users');
/**
 * @api {get} /api/v1 Api Landing Route
 * @apiName Landing
 * @apiGroup Api
 *
 *
 * @apiSuccess {String} status Status of the request.
 * @apiSuccess {Object} body  Body of the response.
 */

//  Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

/* eslint-disable no-unused-vars */
router.get('/', (req, res, next) => {
  res.json({
    status: 'success',
    data: {
      message: 'BuildForSdg Silos Api'
    }
  });
});
/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */
// Register new users
router.post('/auth/register', (req, res, next) => {
  const uploadImage = req.files.photo;

  const {
    firstName, lastName, email, password, phoneNumber, userType, businessName, bio, address
  } = req.body;
  sequelize
    .sync()
    .then(() => cloudinary.uploader.upload(uploadImage.tempFilePath, (err, result) => {
      if (err) {
        console.log(err);
      }
      return result;
    }))
    .then((image) => {
      const imgUrl = image.url;
      // Generate hashed password and store along with other user data
      bcrypt.hash(password, 10, (err, hashed) => {
        if (err) {
          return res.status(500).json({
            status: 'error',
            data: {
              message: err
            }
          });
        }
        return User.build({
          firstName,
          lastName,
          email,
          password: hashed,
          phoneNumber,
          userType,
          businessName,
          bio,
          address,
          photo: imgUrl
        })
          .save()
          .then((user) => {
            const { id } = user.dataValues;
            res.status(201).json({
              status: 'success',
              data: {
                message: 'User created successfully',
                userId: id
              }
            });
          });
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        data: {
          message: err
        }
      });
    });
});
/* eslint-disable no-unused-vars */
export default router;
