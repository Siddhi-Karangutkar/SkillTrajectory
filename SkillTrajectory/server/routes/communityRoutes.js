import express from 'express';
import {
    getLeaderboard,
    getReviews,
    createReview,
    updateStreak
} from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.route('/reviews')
    .get(getReviews)
    .post(protect, createReview);
router.post('/update-streak', protect, updateStreak);

export default router;
