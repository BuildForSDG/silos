import { body, validationResult } from 'express-validator';

export const userValidationRules = () => [
  body('firstName', 'firstName is required').not().isEmpty(),
  body('lastName', 'lastName is required').not().isEmpty(),
  body('email', 'email is required, make sure it is in the pattern yourmailname@domain.com').isEmail().not().isEmpty(),
  body('password', 'password is required').not().isEmpty(),
  body('phoneNumber', 'phoneNumber is required').not().isEmpty(),
  body('userType', 'userType is required').not().isEmpty(),
  body('businessName', 'businessName is required').not().isEmpty(),
  body('bio').optional(),
  body('address', 'address is required').not().isEmpty(),
  body('photo').optional()
];

export const loginValidationRules = () => [
  body('email', 'email is required, make sure it is in the pattern yourmailname@domain.com').isEmail().not().isEmpty(),
  body('password', 'password is required').not().isEmpty()
];

export const createProductValidationRules = () => [
  body('productName', 'Product Name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('availableQuantity', 'Quantity is required').not().isEmpty(),
  body('categoryId', 'Category is required').not().isEmpty(),
  body('price', 'Price is required').not().isEmpty(),
  body('unit', 'Unit is required').not().isEmpty()
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = {};

  /* eslint-disable no-return-assign */
  errors.array().map((err) => (extractedErrors[err.param] = err.msg));

  return res.status(400).json({
    status: 'error',
    errors: extractedErrors
  });
};

// module.exports = { userValidationRules, validate };

/**
 * References:
 * - https://express-validator.github.io/docs/
 * - https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
 */
