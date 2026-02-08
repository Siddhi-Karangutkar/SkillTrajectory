import express from 'express';
import {
    getProfile,
    updateProfile,
    getAICareerInsights,
    getAISectorTransitions,
    getAICareerSimulation,
    getAIRoleRecommendations,
    getSkillGapAnalysis,
    getRecommendedCourses,
    getStudyVelocityInsights,
    getMarketDemandTrends,
    getSkillDecayAnalysis,
    getFairnessMetrics,
    getAIJobOpenings,
    getUserDashboardData,
    updateTimelineStatus,
    getSkillWastageJobs
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

router.get('/dashboard-data', protect, getUserDashboardData);
router.put('/timeline/status', protect, updateTimelineStatus);

router.post('/career-insights', protect, getAICareerInsights);
router.get('/sector-transitions', protect, getAISectorTransitions);
router.post('/career-simulation', protect, getAICareerSimulation);
router.get('/role-recommendations', protect, getAIRoleRecommendations);
router.post('/skill-gap-analysis', protect, getSkillGapAnalysis);
router.post('/recommended-courses', protect, getRecommendedCourses);
router.post('/study-velocity', protect, getStudyVelocityInsights);
router.get('/market-demand-trends', protect, getMarketDemandTrends);
router.get('/skill-decay-analysis', protect, getSkillDecayAnalysis);
router.get('/fairness-metrics', protect, getFairnessMetrics);
router.post('/job-openings', protect, getAIJobOpenings);
router.post('/skill-wastage-jobs', protect, getSkillWastageJobs);

export default router;
