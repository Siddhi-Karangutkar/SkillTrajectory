import User from '../models/User.js';

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
            user.profile.bio = req.body.bio || user.profile.bio;
            user.profile.skills = req.body.skills || user.profile.skills;
            user.profile.location = req.body.location || user.profile.location;
            user.profile.currentRole = req.body.currentRole || user.profile.currentRole;
            user.profile.yearsOfExperience = req.body.yearsOfExperience || user.profile.yearsOfExperience;

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
