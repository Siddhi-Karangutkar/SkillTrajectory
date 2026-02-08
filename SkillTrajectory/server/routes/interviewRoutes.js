import express from 'express';
import { startInterviewSession, submitInterviewAnswer, finishInterviewSession } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startInterviewSession);
router.post('/submit', protect, submitInterviewAnswer);
router.post('/finish', protect, finishInterviewSession);

export default router;
