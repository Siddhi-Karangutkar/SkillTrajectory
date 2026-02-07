import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Community = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'leaderboard'

    // High-quality Dummy Data
    const dummyReviews = [
        {
            _id: 'd1',
            user: {
                username: 'alex_dev',
                email: 'alex.rivera@finova.ai',
                profile: {
                    fullName: 'Alex Rivera',
                    currentRole: 'Full Stack Developer',
                    linkedIn: 'https://linkedin.com/in/alex-rivera-dev'
                }
            },
            content: "SkillTrajectory completely changed how I approach my career. The AI recommended React and Node.js paths, and 3 months later, I'm at a top fintech startup!",
            jobSecured: "Senior Full Stack Dev @ Finova",
            coursesEnrolled: ["React Advanced Patterns", "Microservices Architecture"],
            rating: 5,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'd2',
            user: {
                username: 'sarah_m',
                email: 'sarah.miller@edustream.com',
                profile: {
                    fullName: 'Sarah Miller',
                    currentRole: 'Product Manager',
                    linkedIn: 'https://linkedin.com/in/sarah-miller-pm'
                }
            },
            content: "The Sector Transitions feature is a game-changer. I moved from Retail to EdTech seamlessly by following the skill gap analysis.",
            jobSecured: "Product Lead @ EduStream",
            coursesEnrolled: ["Agile Product Management", "UX Research Fundamentals"],
            rating: 5,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'd3',
            user: {
                username: 'james_k',
                email: 'j.knight@deeplogic.tech',
                profile: {
                    fullName: 'James Knight',
                    currentRole: 'Data Scientist',
                    linkedIn: 'https://linkedin.com/in/james-knight-ai'
                }
            },
            content: "Seeing my daily streak grow kept me motivated. This isn't just a career tool; it's a support system.",
            jobSecured: "AI Researcher @ DeepLogic",
            coursesEnrolled: ["PyTorch for Professionals", "Mastering LLMs"],
            rating: 5,
            createdAt: new Date().toISOString()
        }
    ];

    const dummyLeaderboard = [
        { _id: 'l1', username: 'top_traveler', profile: { fullName: 'Sarah Miller', currentRole: 'Product Lead', streak: 45, points: 2850 } },
        { _id: 'l2', username: 'alex_dev', profile: { fullName: 'Alex Rivera', currentRole: 'Full Stack Dev', streak: 32, points: 2100 } },
        { _id: 'l3', username: 'code_wizard', profile: { fullName: 'Marcus Chen', currentRole: 'Backend Engineer', streak: 28, points: 1950 } },
        { _id: 'l4', username: 'data_pro', profile: { fullName: 'Elena Vogt', currentRole: 'Data Analyst', streak: 15, points: 1200 } },
        { _id: 'l5', username: 'ux_queen', profile: { fullName: 'Aria Song', currentRole: 'UI/UX Designer', streak: 12, points: 980 } }
    ];

    const [reviews, setReviews] = useState(dummyReviews);
    const [leaderboard, setLeaderboard] = useState(dummyLeaderboard);
    const [loading, setLoading] = useState(false); // No local loading spinner for initial dummy view
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({ content: '', jobSecured: '', coursesEnrolled: '', rating: 5 });

    useEffect(() => {
        fetchData();
        // Update streak on page load
        if (user) {
            axios.post('http://localhost:5000/api/community/update-streak', {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            }).catch(err => console.error('Streak update failed:', err));
        }
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'reviews') {
                const res = await axios.get('http://localhost:5000/api/community/reviews');
                if (res.data && res.data.length > 0) {
                    setReviews([...res.data, ...dummyReviews]);
                }
            } else {
                const res = await axios.get('http://localhost:5000/api/community/leaderboard');
                if (res.data && res.data.length > 0) {
                    // Merge and sort by points
                    const combined = [...res.data, ...dummyLeaderboard.filter(d => !res.data.find(r => r.username === d.username))];
                    setLeaderboard(combined.sort((a, b) => (b.profile?.points || 0) - (a.profile?.points || 0)));
                }
            }
        } catch (error) {
            console.error('Error fetching community data, showing dummy only:', error);
        }
    };

    const handleCreateReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const courses = newReview.coursesEnrolled.split(',').map(c => c.trim()).filter(c => c);
            const res = await axios.post('http://localhost:5000/api/community/reviews', {
                ...newReview,
                coursesEnrolled: courses
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setReviews([res.data, ...reviews]);
            setShowReviewModal(false);
            setNewReview({ content: '', jobSecured: '', coursesEnrolled: '', rating: 5 });
        } catch (error) {
            console.error('Error creating review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '120px 20px', background: '#FFFFFF', position: 'relative' }}>
            {/* Background Accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)', zIndex: 0 }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 style={{ fontSize: '4rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '20px', letterSpacing: '-2px' }}>
                            Community Hub
                        </h1>
                        <p style={{ color: '#666', fontSize: '1.4rem', maxWidth: '750px', margin: '0 auto', fontWeight: '500', lineHeight: '1.5' }}>
                            Where trajectory travelers share their
                            <span style={{ color: '#FF6E14', fontWeight: '900' }}> success stories </span>
                            and conquer the daily
                            <span style={{ color: '#FFB800', fontWeight: '900' }}> streaks</span>.
                        </p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    background: '#FFF',
                    padding: '10px',
                    borderRadius: '28px',
                    width: 'fit-content',
                    margin: '0 auto 5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid #F0F0F0'
                }}>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        style={{
                            padding: '14px 40px',
                            borderRadius: '20px',
                            border: 'none',
                            fontWeight: '900',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            background: activeTab === 'reviews' ? '#1A1A1A' : 'transparent',
                            color: activeTab === 'reviews' ? '#FFF' : '#666',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeTab === 'reviews' ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        Traveler Wins
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        style={{
                            padding: '14px 40px',
                            borderRadius: '20px',
                            border: 'none',
                            fontWeight: '900',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            background: activeTab === 'leaderboard' ? '#1A1A1A' : 'transparent',
                            color: activeTab === 'leaderboard' ? '#FFF' : '#666',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeTab === 'leaderboard' ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        Leaderboard
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'reviews' ? (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '5px' }}>Member Success</h2>
                                    <p style={{ color: '#888', fontWeight: '700' }}>Recent career pivots and milestone achievements.</p>
                                </div>
                                {user && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowReviewModal(true)}
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6E14, #FFB800)',
                                            color: '#FFF',
                                            padding: '16px 32px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            boxShadow: '0 15px 35px rgba(255, 110, 20, 0.25)',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Share Your Win
                                    </motion.button>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                                {reviews.map((review, idx) => (
                                    <motion.div
                                        key={review._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -5, boxShadow: '0 25px 50px rgba(0,0,0,0.04)' }}
                                        style={{
                                            background: '#FFF',
                                            padding: '2.5rem',
                                            borderRadius: '35px',
                                            border: '1px solid #F0F0F0',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                                            display: 'flex',
                                            gap: '3rem',
                                            alignItems: 'flex-start',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {/* Left Column: User Profile */}
                                        <div style={{ minWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '24px',
                                                background: 'linear-gradient(135deg, #FF6E14, #FFB800)',
                                                color: '#FFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem',
                                                fontWeight: '950',
                                                boxShadow: '0 10px 25px rgba(255, 110, 20, 0.2)',
                                                marginBottom: '15px'
                                            }}>
                                                {review.user?.profile?.fullName?.[0] || review.user?.username?.[0] || 'U'}
                                            </div>
                                            <div style={{ fontWeight: '950', color: '#1A1A1A', fontSize: '1.25rem', marginBottom: '5px' }}>
                                                {review.user?.profile?.fullName || review.user?.username}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: '800', lineHeight: '1.3', marginBottom: '15px' }}>
                                                {review.user?.profile?.currentRole}
                                            </div>

                                            {/* Contact Info */}
                                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                                {review.user?.email && (
                                                    <a href={`mailto:${review.user.email}`} title={review.user.email} style={{
                                                        color: '#FF6E14',
                                                        background: 'rgba(255, 110, 20, 0.1)',
                                                        padding: '8px',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                                    </a>
                                                )}
                                                {review.user?.profile?.linkedIn && (
                                                    <a href={review.user.profile.linkedIn} target="_blank" rel="noopener noreferrer" style={{
                                                        color: '#0077b5',
                                                        background: 'rgba(0, 119, 181, 0.1)',
                                                        padding: '8px',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column: Experience & Wins */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', top: '-15px', left: '-15px', fontSize: '3rem', color: '#F0F0F0', zIndex: 0, fontFamily: 'serif' }}>"</span>
                                                <p style={{ color: '#333', lineHeight: '1.7', fontWeight: '600', marginBottom: '2rem', fontSize: '1.2rem', position: 'relative', zIndex: 1, letterSpacing: '-0.3px' }}>
                                                    {review.content}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>
                                                {review.jobSecured && (
                                                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10B981', padding: '12px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                                        <span style={{ fontSize: '1.4rem' }}>🎉</span>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '900' }}>{review.jobSecured}</span>
                                                    </div>
                                                )}

                                                {review.coursesEnrolled?.length > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#BBB', textTransform: 'uppercase', letterSpacing: '1px' }}>Boosts:</span>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                            {review.coursesEnrolled.map((course, ci) => (
                                                                <span key={ci} style={{ fontSize: '0.8rem', fontWeight: '800', color: '#666', background: '#F8F9FA', padding: '6px 14px', borderRadius: '12px', border: '1px solid #EEE' }}>
                                                                    {course}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            style={{ maxWidth: '900px', margin: '0 auto' }}
                        >
                            <div style={{ background: '#FFF', borderRadius: '40px', border: '1px solid #F0F0F0', boxShadow: '0 30px 100px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                                <div style={{ padding: '3.5rem', background: '#FFF', color: '#1A1A1A', borderBottom: '1px solid #F0F0F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '10px', letterSpacing: '-1.5px', color: '#1A1A1A' }}>Global Trajectory Ranking</h2>
                                            <p style={{ color: '#666', fontWeight: '700', fontSize: '1.1rem' }}>Elite members based on consistent growth and points.</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 10px 15px rgba(255, 184, 0, 0.3))' }}>🏆</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '2rem' }}>
                                    {leaderboard.map((userEntry, idx) => (
                                        <motion.div
                                            key={userEntry._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '24px 30px',
                                                borderRadius: '24px',
                                                background: idx === 0 ? 'rgba(255, 184, 0, 0.05)' : (idx === 1 ? 'rgba(150, 150, 150, 0.05)' : 'transparent'),
                                                marginBottom: '12px',
                                                border: idx === 0 ? '1px solid rgba(255, 184, 0, 0.2)' : (idx === 1 ? '1px solid rgba(150, 150, 150, 0.2)' : '1px solid transparent'),
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div style={{ width: '60px', fontSize: '1.8rem', fontWeight: '950', color: idx === 0 ? '#FFB800' : (idx === 1 ? '#999' : (idx === 2 ? '#CD7F32' : '#EEE')), fontStyle: 'italic' }}>
                                                {idx + 1}
                                            </div>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '20px',
                                                background: '#1A1A1A',
                                                color: '#FFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.3rem',
                                                fontWeight: '900',
                                                marginRight: '25px',
                                                boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
                                            }}>
                                                {userEntry.profile?.fullName?.[0] || userEntry.username?.[0]}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '900', color: '#1A1A1A', fontSize: '1.2rem' }}>
                                                    {userEntry.profile?.fullName || userEntry.username}
                                                    {userEntry._id === user?.id && <span style={{ marginLeft: '12px', fontSize: '0.7rem', background: '#FF6E14', color: '#FFF', padding: '3px 10px', borderRadius: '8px', verticalAlign: 'middle', fontWeight: '900' }}>YOU</span>}
                                                </div>
                                                <div style={{ fontSize: '0.95rem', color: '#888', fontWeight: '700' }}>{userEntry.profile?.currentRole}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.4rem', fontWeight: '950', color: '#1A1A1A' }}>{userEntry.profile?.points.toLocaleString()} pts</div>
                                                <div style={{ fontSize: '0.9rem', color: '#FF6E14', fontWeight: '900', marginTop: '4px' }}>🔥 {userEntry.profile?.streak}d Streak</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{
                                background: '#FFF',
                                padding: '3rem',
                                borderRadius: '32px',
                                width: '100%',
                                maxWidth: '600px',
                                boxShadow: '0 30px 100px rgba(0,0,0,0.2)'
                            }}
                        >
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Share Your Journey</h2>
                            <p style={{ color: '#666', marginBottom: '2rem', fontWeight: '600' }}>Tell us about your experience and inspire others!</p>

                            <form onSubmit={handleCreateReview}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '8px' }}>Your Experience</label>
                                    <textarea
                                        required
                                        value={newReview.content}
                                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                        placeholder="What did you learn? How has SkillTrajectory helped you?"
                                        style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #EEE', minHeight: '120px', resize: 'vertical', fontSize: '1rem', fontWeight: '600' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '8px' }}>Job Secured (Optional)</label>
                                        <input
                                            type="text"
                                            value={newReview.jobSecured}
                                            onChange={(e) => setNewReview({ ...newReview, jobSecured: e.target.value })}
                                            placeholder="e.g. Frontend Dev at Google"
                                            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #EEE', fontSize: '1rem', fontWeight: '600' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '8px' }}>Rating</label>
                                        <select
                                            value={newReview.rating}
                                            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #EEE', fontSize: '1rem', fontWeight: '600' }}
                                        >
                                            <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                            <option value="4">⭐⭐⭐⭐ (Great)</option>
                                            <option value="3">⭐⭐⭐ (Average)</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '8px' }}>Courses Enrolled (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={newReview.coursesEnrolled}
                                        onChange={(e) => setNewReview({ ...newReview, coursesEnrolled: e.target.value })}
                                        placeholder="e.g. React Mastery, UI/UX Basics"
                                        style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #EEE', fontSize: '1rem', fontWeight: '600' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewModal(false)}
                                        style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: '#F0F2F5', color: '#666', fontWeight: '800', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            flex: 2,
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            background: '#1A1A1A',
                                            color: '#FFF',
                                            fontWeight: '800',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            opacity: isSubmitting ? 0.7 : 1
                                        }}
                                    >
                                        {isSubmitting ? 'Sharing...' : 'Post Experience'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Community;
