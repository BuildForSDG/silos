import express from 'express';
import { getLandingPage, registerNewUser, userSignin } from '../controller/userController';
import { userValidationRules, validate } from '../middleware/validator';

const router = express.Router();

router.get('/', getLandingPage);
router.post('/auth/register', userValidationRules(), validate, registerNewUser);
router.post('/auth/signin', userSignin);

export default router;
