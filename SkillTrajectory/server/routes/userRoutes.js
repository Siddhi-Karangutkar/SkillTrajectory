import express from 'express';
import {
    getProfile,
    updateProfile,
    getAICareerInsights,
    getAISectorTransitions,
    getAICareerSimulation,
    getAIRoleRecommendations
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

router.post('/career-insights', protect, getAICareerInsights);
router.get('/sector-transitions', protect, getAISectorTransitions);
router.post('/career-simulation', protect, getAICareerSimulation);
router.get('/role-recommendations', protect, getAIRoleRecommendations);

export default router;
