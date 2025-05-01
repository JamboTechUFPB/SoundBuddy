import express from 'express';
import { postController } from '../controllers/postController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { uploadPostMedia } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.post('/posts/create', authenticateToken, uploadPostMedia.single('media'), postController.createPost);
router.get('/posts', authenticateToken, postController.getPosts);
router.get('/posts/user', authenticateToken, postController.getUserPosts);
router.get('/posts/:username', authenticateToken, postController.getPublicUserPosts);

export default router;