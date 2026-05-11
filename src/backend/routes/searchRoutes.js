import express from 'express';
import { searchController } from '../controllers/searchController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { uploadPostMedia } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.get('/search', authenticateToken, searchController.search);
router.get('/search/popular-tags', authenticateToken, searchController.getMostUsedTags);

export default router;