import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/chat', chatRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'SkillTrajectory API is running...' });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Port mapping for dev (stub)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Database connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            console.log('Ensure your MongoDB service is running (e.g., "sudo service mongod start" or using MongoDB Compass)');
        });
} else {
    console.warn('⚠️ No MONGODB_URI found in .env. Database features will be unavailable.');
}

// Disable Mongoose command buffering to avoid 10s timeouts on queries
mongoose.set('bufferCommands', false);
