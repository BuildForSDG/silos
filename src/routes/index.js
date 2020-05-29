import express from 'express';
import { createProduct } from '../controller/productsController';
import {
  userValidationRules,
  loginValidationRules,
  createProductValidationRules,
  validate
} from '../middleware/validator';
import {
  getLandingPage, registerNewUser, userSignin, getUserProfile
} from '../controller/userController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', getLandingPage);
router.post('/auth/register', userValidationRules(), validate, registerNewUser);
router.post('/auth/signin', loginValidationRules(), validate, userSignin);
router.post('/products/create', auth, createProductValidationRules(), validate, createProduct);
router.get('/users/:userId', auth, getUserProfile);

export default router;
