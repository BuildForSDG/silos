import express from 'express';
import { getLandingPage, registerNewUser } from '../controller/userController';

const router = express.Router();

router.get('/', getLandingPage);
router.post('/auth/register', registerNewUser);

export default router;
