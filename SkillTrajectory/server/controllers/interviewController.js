import User from '../models/User.js';
import * as aiService from '../services/aiService.js';
import { logActivity } from '../utils/activityLogger.js';

export const startInterviewSession = async (req, res) => {
    try {
        const { topic } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const firstQuestion = await aiService.getInterviewQuestion(topic, user.profile);

        await logActivity(user._id, 'INTERVIEW_START');

        res.json({
            sessionId: Date.now().toString(),
            question: firstQuestion
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitInterviewAnswer = async (req, res) => {
    try {
        const { topic, question, answer, history } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Analyze current answer
        const feedback = await aiService.analyzeInterviewResponse(question, answer, user.profile);

        // Generate next question
        const nextQuestion = await aiService.getInterviewQuestion(topic, user.profile, [...history, { question, answer }]);

        await logActivity(user._id, 'INTERVIEW_ANSWER');

        // Update user points for participating
        user.profile.points += 20;
        await user.save();

        res.json({
            feedback,
            nextQuestion
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const finishInterviewSession = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await logActivity(user._id, 'INTERVIEW_COMPLETE');
        user.profile.points += 100; // Bonus for completion
        await user.save();

        res.json({ message: 'Interview session recorded successfully', bonusPoints: 100 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
