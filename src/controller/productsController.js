import cloudinary from 'cloudinary';
import sequelize from '../config/sequelize';

const Product = sequelize.import('../models/products');
const User = sequelize.import('../models/users');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

/**
 * @api {post} /api/v1/products/create Create a product
 * @apiName CreateProduct
 * @apiGroup Products
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer ae45509nlklsnkndninosndnsnndnsdlskdnllkjkjlk"
 *     }
 *
 * @apiParam {String} product_name Name of product
 * @apiParam {String} description Product's brief description
 * @apiParam {String} available_quantity Current available quantity,
 * @apiParam {String} image Product's Image
 * @apiParam {String} category_id Category Id of the product
 * @apiParam {String} price Price per unit of the product
 * @apiParam {String} unit Unit of the product
 *
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 201 OK
 * {
 *   "status": "success",
 *  "data": {
 *     "message": "Product created successfully",
 *     "productId": 1
 *   }
 * }
 *
 * @apiError Internal Server Error
 *
 * @apiErrorExample Error Response:
 * HTTP/1.1 500 Server error
 * {
 *    "status": "error",
 *    "errors": {
 *      "message":"error message"
 *    }
 * }
 *
 */
/* eslint-disable import/prefer-default-export */
export const createProduct = async (req, res) => {
  let uploadImage;
  let imgUrl = null;
  let secureUrl = null;

  // Check if the user attach an image or not
  if (req.files) {
    uploadImage = req.files.image;
  }

  const {
    productName, description, availableQuantity, categoryId, price, unit
  } = req.body;
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user.dataValues.userType !== 'producer') {
      return res.status(422).json({
        status: 'error',
        errors: { message: 'Only Producers can create products' }
      });
    }

    if (uploadImage) {
      imgUrl = await cloudinary.uploader.upload(uploadImage.tempFilePath);
      secureUrl = imgUrl.secure_url;
    }

    const product = await Product.build({
      userId,
      productName,
      description,
      availableQuantity,
      image: secureUrl,
      categoryId,
      price,
      unit
    }).save();

    const created = product.dataValues;

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Product Created Successfully',
        productID: created.id,
        image: created.image
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      errors: error
    });
  }
};