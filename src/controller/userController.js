import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import sequelize from '../config/sequelize';

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
export const getLandingPage = (req, res, next) => {
  res.json({
    status: 'success',
    data: {
      message: 'BuildForSdg Silos Api'
    }
  });
};
/* eslint-disable no-unused-vars */

/**
 * @api {post} /api/v1/auth/register Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} firstName User first name
 * @apiParam {String} lastName User last name
 * @apiParam {String} email User email, must be unique
 * @apiParam {String} password User password
 * @apiParam {String} phone User contact phone number
 * @apiParam {String} userType Type of user, could be producer, retailer, financial institution
 * @apiParam {String} businessName User's business name
 * @apiParam {String} bio Biography of business
 * @apiParam {String} address Business address
 * @apiParam {File} photo User photograph
 *
 * @apiParamExample Sample body:
 * HTTP/1.1 201 Created
 * {
 *  "firstName":"John",
 *  "lastName":"Doe",
 *  "email":"johndoe@mymail.com",
 *  "password":"johndoe",
 *  "phoneNumber":"098654321",
 *  "userType":"Producer",
 *  "businessName":"My Business",
 *  "bio":"My business biography",
 *  "address":"No 2 Lokoja Stree, Abuja. FCT",
 *  "photo": File
 * }
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 201 OK
 * {
 *   "status": "success",
 *  "data": {
 *     "message": "User created successfully",
 *     "userId": 1
 *   }
 * }
 *
 * @apiError Internal Server Error
 *
 * @apiErrorExample Error Response:
 * HTTP/1.1 500 Server error
 * {
 *    "status": "error",
 *    "data": {
 *      "message":"error message"
 *    }
 * }
 *
 */

/* eslint-disable no-unused-vars */
// Register new users
export const registerNewUser = (req, res, next) => {
  let image;
  let uploadImage;
  let imgUrl = '';

  // Check if the user attach an image or not
  if (req.files) {
    uploadImage = req.files.photo;
  }

  const {
    firstName, lastName, email, password, phoneNumber, userType, businessName, bio, address
  } = req.body;

  // Check if given email is already in use
  User.findOne({ where: { email } })
    .then((check) => {
      if (check) {
        return res.status(403).json({
          status: 'error',
          data: {
            message: `User with the email: ${email} already exist`
          }
        });
      }
      return check;
    })
    .catch((err) => res.status(500).json({
      status: 'error',
      data: {
        message: err
      }
    }));

  // Check if an image is present in the photo filed before uploading to cloudinary
  if (uploadImage) {
    image = cloudinary.uploader.upload(uploadImage.tempFilePath, (err, result) => {
      if (err) {
        return err;
      }
      return result;
    });
  }

  sequelize
    .sync()
    .then(() => {
      if (image) {
        imgUrl = image.url;
      }
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
};
/* eslint-disable no-unused-vars */
