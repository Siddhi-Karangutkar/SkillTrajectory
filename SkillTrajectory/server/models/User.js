import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        fullName: { type: String, default: '' },
        phone: { type: String, default: '' },
        bio: { type: String, default: '' },
        currentRole: { type: String, default: '' },
        location: { type: String, default: '' },
        yearsOfExperience: { type: Number, default: 0 },

        education: [{
            school: String,
            degree: String,
            fieldOfStudy: String,
            startYear: String,
            endYear: String
        }],

        experience: [{
            company: String,
            position: String,
            location: String,
            startDate: String,
            endDate: String,
            description: String
        }],

        projects: [{
            title: String,
            description: String,
            link: String
        }],

        skills: [{
            name: { type: String, required: true },
            category: { type: String, enum: ['technical', 'soft', 'tools', 'languages'], default: 'technical' },
            level: { type: String, enum: ['Beginner', 'Learning', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
            score: { type: Number, default: 0 }
        }],

        interests: [{ type: String }],
        constraints: {
            preferredLocation: { type: String, default: '' },
            availableTime: { type: String, default: '' }, // e.g., "Full-time", "10 hrs/week"
            incomeNeeds: { type: String, default: '' }
        },
        isOnboardingComplete: { type: Boolean, default: false },
        savedTimeline: {
            roleId: String,
            roleTitle: String,
            nodes: [{
                label: String,
                title: String,
                subtitle: String,
                status: { type: String, enum: ['CURRENT', 'UPCOMING', 'COMPLETED'] },
                description: String,
                skills: [String],
                duration: String
            }]
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
