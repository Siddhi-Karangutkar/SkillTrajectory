import User from '../models/User.js';
import Review from '../models/Review.js';
import { logActivity } from '../utils/activityLogger.js';

// @desc    Get leaderboard
// @route   GET /api/community/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .select('username profile.streak profile.points profile.fullName profile.currentRole')
            .sort({ 'profile.points': -1 })
            .limit(10);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews
// @route   GET /api/community/reviews
// @access  Public
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'username email profile.fullName profile.currentRole profile.linkedIn')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/community/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { content, jobSecured, coursesEnrolled, rating } = req.body;

        const review = await Review.create({
            user: req.user.id,
            content,
            jobSecured,
            coursesEnrolled,
            rating
        });

        await logActivity(req.user.id, 'REVIEW_POST');

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'username email profile.fullName profile.currentRole profile.linkedIn');

        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user streak (Internal or accessible)
// @route   POST /api/community/update-streak
// @access  Private
export const updateStreak = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = new Date();
        const lastActive = new Date(user.profile.lastActive || now);
        const diffInDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

        if (diffInDays === 1) {
            user.profile.streak += 1;
        } else if (diffInDays > 1) {
            user.profile.streak = 1;
        } else if (user.profile.streak === 0) {
            user.profile.streak = 1;
        }

        user.profile.points += 10; // 10 points for daily activity
        user.profile.lastActive = now;

        await logActivity(user._id, 'DAILY_STREAK');
        await user.save();
        res.json({ streak: user.profile.streak, points: user.profile.points });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
