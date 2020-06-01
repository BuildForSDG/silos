import sequelize from '../config/sequelize';

const Category = sequelize.import('../models/category');

/**
 *
 * @api {get} /api/v1/catgories Get all categories
 * @apiName get Categories
 * @apiGroup Categories
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200 OK
 * {
 *   "status": "success",
 *  "data": {
 *     "message": "Categories Fetched Succcessfully",
 *     "categories":  [
 *           {
 *               "id": 1,
 *               "name": "food",
 *               "description": null
 *           },
 *           {
 *               "id": 2,
 *               "name": "live stock",
 *               "description": null
 *           },
 *           {
 *               "id": 3,
 *               "name": "poultry",
 *              "description": null
 *           },
 *       ]
 *   }
 * }
 *
 * @apiError Server Error
 *
 * @apiErrorExample Error Response:
 * HTTP/1.1 500 Unauthorized
 * {
 *    "status": "error",
 *    "data": {
 *      "message":"Server Error",
 *      "error": "Error information"
 *    }
 * }
 */
/* eslint-disable import/prefer-default-export */
export const getCategories = async (req, res) => {
  try {
    // Find the user by primary key.
    const categories = await Category.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (categories) {
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'categories fetched successfully',
          categories
        }
      });
    }
    return res.status(404).json({
      status: 'error',
      error: {
        message: 'Categories not found.'
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
