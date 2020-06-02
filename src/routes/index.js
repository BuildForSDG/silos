import express from 'express';
import {
  createProduct,
  updateProduct,
  getProducts
} from '../controller/productsController';
import {
  userValidationRules,
  loginValidationRules,
  createProductValidationRules,
  validate
} from '../middleware/validator';
import {
  getLandingPage, registerNewUser, userSignin, getUserProfile, getUsersProducts
} from '../controller/userController';
import auth from '../middleware/auth';
import { getCategories } from '../controller/utilityController';

const router = express.Router();

router.get('/', getLandingPage);
router.post('/auth/register', userValidationRules(), validate, registerNewUser);
router.post('/auth/signin', loginValidationRules(), validate, userSignin);
router.post('/products/create', auth, createProductValidationRules(), validate, createProduct);
router.put('/products/:productId/update', auth, validate, updateProduct);
router.get('/users/:userId', auth, getUserProfile);
router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/users/:userId/products', getUsersProducts);

export default router;
