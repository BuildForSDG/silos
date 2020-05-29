import express from 'express';
import {
  getLandingPage, registerNewUser, userSignin, getUserProfile
} from '../controller/userController';
import { userValidationRules, loginValidationRules, validate } from '../middleware/validator';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', getLandingPage);
router.post('/auth/register', userValidationRules(), validate, registerNewUser);
router.post('/auth/signin', loginValidationRules(), validate, userSignin);
router.get('/users/:userId', auth, getUserProfile);

export default router;
