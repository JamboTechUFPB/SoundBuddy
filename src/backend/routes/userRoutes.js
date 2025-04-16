import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.post('/users/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/refresh-token', userController.refreshToken);

export default router;