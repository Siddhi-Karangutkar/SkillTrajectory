import User from '../models/User.js';

/**
 * Logs a user activity for the dashboard heatmap and stats.
 * @param {string} userId - The ID of the user.
 * @param {string} activityType - Type of activity (e.g., 'TIMELINE_SAVE', 'COURSE_VIEW', 'STREAK_UPDATE').
 */
export const logActivity = async (userId, activityType) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Try to update existing log for today
        // We use $inc to increment the count and $push to add the specific activity record
        const result = await User.findOneAndUpdate(
            { _id: userId, 'profile.activityLogs.date': today },
            {
                $inc: { 'profile.activityLogs.$.count': 1 },
                $push: {
                    'profile.activityLogs.$.activities': {
                        type: activityType,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        // If no log for today exists, push a new day's log
        if (!result) {
            await User.findByIdAndUpdate(userId, {
                $push: {
                    'profile.activityLogs': {
                        date: today,
                        count: 1,
                        activities: [{
                            type: activityType,
                            timestamp: new Date()
                        }]
                    }
                }
            });
        }

        // console.log(`Activity logged: ${activityType} for user ${userId}`);
    } catch (error) {
        console.error('Activity logging failed:', error);
    }
};
