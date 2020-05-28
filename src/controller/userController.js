import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
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
        .catch((err) => res.status(500).json({
          status: 'error',
          data: {
            message: err
          }
        }));
      return true;
    })
    .catch((err) => res.status(500).json({
      status: 'error',
      data: {
        message: err
      }
    }));
};
/* eslint-disable no-unused-vars */

/**
 *
 * @api {post} /api/v1/auth/signin Login an existing user
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 *
 * @apiParamExample Sample body:
 * HTTP/1.1 200 OK
 * {
 *  "email":"johndoe@mymail.com",
 *  "password":"johndoe",
 * }
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200 OK
 * {
 *   "status": "success",
 *  "data": {
 *     "message": "Authentication successful",
 *     "token": "b3hv34kjkj34m4m.5m6h6o.67k87n5h3u3n3b4n5n67kjkbsdkjfjgjfkgfjfhj."
 *   }
 * }
 *
 * @apiError Authentication Failed
 *
 * @apiErrorExample Error Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *    "status": "error",
 *    "data": {
 *      "message":"Authentication Failed"
 *    }
 * }
 */

export const userSignin = (req, res, next) => {
  const { email, password } = req.body;

  // Check if given user email is in database
  User.findOne({ where: { email } })
    .then((user) => {
      if (user === null) {
        return res.status(404).json({
          status: 'error',
          data: {
            message: `user with email ${email} does not exist`
          }
        });
      }

      // If found in database decode password from database and compare with one given
      bcrypt.compare(password, user.dataValues.password, (err, response) => {
        if (err !== undefined) {
          return res.status(500).json({
            status: 'error',
            message: 'An error occurred on comaparing password'
          });
        }

        if (response === false) {
          return res.status(401).json({
            status: 'error',
            message: 'Authentication Failed: Wrong Password'
          });
        }

        // Generate token if password matches above
        if (response) {
          const token = jwt.sign(
            {
              email: user.dataValues.email,
              id: user.dataValues.id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '24hr'
            }
          );
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'Authentication Successful',
              token
            }
          });
        }

        return res.status(401).json({
          status: 'error',
          message: 'Authentication Failed'
        });
      });
      return true;
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

/**
 *
 * @api {get} /api/v1/users/:userId View profile of a user
 * @apiName ViewUserProfile
 * @apiGroup User
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200 OK
 * {
 *   "status": "success",
 *  "data": {
 *     "message": "User found",
 *     "user": {
 *        "firstName":"John",
 *        "lastName":"Doe",
 *        "email":"johndoe@mymail.com",
 *        "password":"johndoe",
 *        "phoneNumber":"098654321",
 *        "userType":"Producer",
 *        "businessName":"My Business",
 *        "bio":"My business biography",
 *        "address":"No 2 Lokoja Stree, Abuja. FCT",
 *        "photo": 'http://link-to-file'
 *      }
 *   }
 * }
 *
 * @apiError Authentication Failed
 *
 * @apiErrorExample Error Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *    "status": "error",
 *    "data": {
 *      "message":"Authentication Failed",
 *      "error": "Error information"
 *    }
 * }
 */

export const getUserProfile = async (req, res, next) => {
  const { userId } = req.params;
  try {
    // Find the user by primary key.
    const user = await User.findByPk(userId);

    if (user) {
      return res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    }
    return res.status(404).json({
      status: 'error',
      error: {
        message: 'User does not exist.'
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: {
        message: 'Internal Server error',
        error
      }
    });
  }
};
