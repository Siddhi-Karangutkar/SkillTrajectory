import User from '../models/User.js';
import * as aiService from '../services/aiService.js';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.profile.fullName = req.body.fullName || user.profile.fullName;
            user.profile.phone = req.body.phone || user.profile.phone;
            user.profile.bio = req.body.bio || user.profile.bio;
            user.profile.currentRole = req.body.currentRole || user.profile.currentRole;
            user.profile.location = req.body.location || user.profile.location;
            user.profile.yearsOfExperience = req.body.yearsOfExperience || user.profile.yearsOfExperience;

            user.profile.education = req.body.education || user.profile.education;
            user.profile.experience = req.body.experience || user.profile.experience;
            user.profile.projects = req.body.projects || user.profile.projects;
            user.profile.skills = req.body.skills || user.profile.skills;
            user.profile.interests = req.body.interests || user.profile.interests;
            user.profile.constraints = req.body.constraints || user.profile.constraints;

            user.profile.savedTimeline = req.body.savedTimeline || user.profile.savedTimeline;
            user.profile.isOnboardingComplete = req.body.isOnboardingComplete !== undefined ? req.body.isOnboardingComplete : user.profile.isOnboardingComplete;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profile: updatedUser.profile
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAICareerInsights = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { targetRole } = req.body;
        if (!user) return res.status(404).json({ message: 'User not found' });

        const insights = await aiService.getCareerInsights(user.profile, targetRole);
        res.json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAISectorTransitions = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const transitions = await aiService.getSectorTransitions(user.profile);
        res.json(transitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAICareerSimulation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { parameters } = req.body;
        if (!user) return res.status(404).json({ message: 'User not found' });

        const simulation = await aiService.getSimulationData(user.profile, parameters);
        res.json(simulation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAIRoleRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const recommendations = await aiService.getRoleRecommendations(user.profile);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSkillGapAnalysis = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const targetRole = req.body.targetRole || user.profile.savedTimeline?.roleTitle;

        const analysis = await aiService.getSkillGapAnalysis(user.profile, targetRole);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecommendedCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const filters = req.body.filters;

        const courses = await aiService.getRecommendedCourses(user.profile, filters);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudyVelocityInsights = async (req, res) => {
    try {
        const { courses, weeklyHours } = req.body;
        const insights = await aiService.getStudyVelocityInsights(courses, weeklyHours);
        res.json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
