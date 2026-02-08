import User from '../models/User.js';
import * as aiService from '../services/aiService.js';
import { logActivity } from '../utils/activityLogger.js';

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
            user.profile.targetRole = req.body.targetRole || user.profile.targetRole;
            user.profile.location = req.body.location || user.profile.location;
            user.profile.yearsOfExperience = req.body.yearsOfExperience || user.profile.yearsOfExperience;

            user.profile.education = req.body.education || user.profile.education;
            user.profile.experience = req.body.experience || user.profile.experience;
            user.profile.projects = req.body.projects || user.profile.projects;
            user.profile.skills = req.body.skills || user.profile.skills;
            user.profile.interests = req.body.interests || user.profile.interests;
            user.profile.constraints = req.body.constraints || user.profile.constraints;

            user.profile.savedTimeline = req.body.savedTimeline || user.profile.savedTimeline;
            if (req.body.savedTimeline) {
                await logActivity(user._id, 'TIMELINE_SAVE');
                user.profile.points += 50; // Points for defining a career path
            }
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
        await logActivity(user._id, 'CAREER_INSIGHTS');
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
        await logActivity(user._id, 'SECTOR_TRANSITIONS');
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
        await logActivity(user._id, 'CAREER_SIMULATION');
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
        await logActivity(user._id, 'SKILL_GAP_ANALYSIS');
        user.profile.points += 10;
        await user.save();
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
        await logActivity(user._id, 'COURSE_RECOMMENDATIONS');
        user.profile.points += 5;
        await user.save();
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

export const getMarketDemandTrends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const trends = await aiService.getMarketDemandTrends(user.profile);
        await logActivity(user._id, 'MARKET_TRENDS_CHECK');
        user.profile.points += 5;
        await user.save();
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSkillDecayAnalysis = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const analysis = await aiService.getSkillDecayAnalysis(user.profile);
        await logActivity(user._id, 'SKILL_DECAY_CHECK');
        user.profile.points += 5;
        await user.save();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFairnessMetrics = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const fairness = await aiService.getFairnessMetrics(user.profile);
        await logActivity(user._id, 'FAIRNESS_CHECK');
        user.profile.points += 5;
        await user.save();
        res.json(fairness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAIJobOpenings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const targetRole = req.body.targetRole || user.profile.savedTimeline?.roleTitle || user.profile.currentRole;
        if (!targetRole) return res.status(400).json({ message: 'Target role or current role is required to generate job openings' });

        const jobOpenings = await aiService.getJobOpenings(user.profile, targetRole);
        await logActivity(user._id, 'JOB_SEARCH');
        user.profile.points += 10;
        await user.save();
        res.json(jobOpenings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserDashboardData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username profile.fullName profile.currentRole profile.streak profile.points profile.activityLogs profile.lastActive');
        if (!user) return res.status(404).json({ message: 'User not found' });

        let activityLogs = user.profile.activityLogs || [];
        let points = user.profile.points || 0;
        let streak = user.profile.streak || 0;

        // Inject Dummy Data if the user is new/empty for demonstration
        if (activityLogs.length === 0) {
            points = 1240;
            streak = 15;

            // Generate random activity for the last 3 months
            const today = new Date();
            const types = ['COURSE_SEARCH', 'TIMELINE_SAVE', 'REVIEW_POST', 'SKILL_UPDATE', 'CAREER_SIMULATION'];

            for (let i = 0; i < 90; i++) {
                if (Math.random() > 0.7) { // 30% chance of activity on any given day
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];

                    const count = Math.floor(Math.random() * 5) + 1;
                    const dayActivities = [];
                    for (let j = 0; j < count; j++) {
                        dayActivities.push({
                            type: types[Math.floor(Math.random() * types.length)],
                            timestamp: new Date(date)
                        });
                    }

                    activityLogs.push({
                        date: dateStr,
                        count: count,
                        activities: dayActivities
                    });
                }
            }
        }

        // Calculate Tier
        let tier = 'Beginner';
        let nextTier = 'Novice';
        let progress = Math.min((points / 500) * 100, 100);

        if (points >= 2500) {
            tier = 'Expert';
            nextTier = 'Master';
            progress = 100;
        } else if (points >= 1500) {
            tier = 'Advanced';
            nextTier = 'Expert';
            progress = ((points - 1500) / 1000) * 100;
        } else if (points >= 800) {
            tier = 'Intermediate';
            nextTier = 'Advanced';
            progress = ((points - 800) / 700) * 100;
        } else if (points >= 300) {
            tier = 'Novice';
            nextTier = 'Intermediate';
            progress = ((points - 300) / 500) * 100;
        }

        res.json({
            fullName: user.profile.fullName || user.username,
            currentRole: user.profile.currentRole,
            streak: streak,
            points: points,
            tier,
            nextTier,
            tierProgress: Math.round(progress),
            activityLogs: activityLogs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTimelineStatus = async (req, res) => {
    try {
        const { nodeIndex, status } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.profile.savedTimeline || !user.profile.savedTimeline.nodes[nodeIndex]) {
            return res.status(400).json({ message: 'Timeline or node not found' });
        }

        const oldStatus = user.profile.savedTimeline.nodes[nodeIndex].status;
        user.profile.savedTimeline.nodes[nodeIndex].status = status;

        // If newly completed, award points and log activity
        if (status === 'COMPLETED' && oldStatus !== 'COMPLETED') {
            user.profile.points += 100; // Reward for milestone completion
            await logActivity(user._id, 'MILESTONE_COMPLETE');
        } else if (status === 'CURRENT' && oldStatus !== 'CURRENT') {
            await logActivity(user._id, 'MILESTONE_STARTED');
        }

        await user.save();
        res.json(user.profile.savedTimeline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getSkillWastageJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const wastageJobs = await aiService.getSkillWastageJobs(user.profile);
        await logActivity(user._id, 'SKILL_WASTAGE_SEARCH');
        user.profile.points += 15; // High value for social impact
        await user.save();
        res.json(wastageJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAISuggestions = async (req, res) => {
    try {
        const { type, query } = req.query;
        if (!type || !query) return res.status(400).json({ message: 'Type and query are required' });

        const suggestions = await aiService.getAISuggestions(type, query);
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
