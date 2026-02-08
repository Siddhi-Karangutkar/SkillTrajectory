import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Community = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('reviews');

    const dummyReviews = [
        {
            _id: 'd1',
            user: {
                username: 'alex_dev',
                profile: { fullName: 'Alex Rivera', currentRole: 'Full Stack Developer' }
            },
            content: "SkillTrajectory completely changed how I approach my career. The AI recommended React and Node.js paths, and 3 months later, I'm at a top fintech startup!",
            jobSecured: "Senior Full Stack Dev @ Finova",
            coursesEnrolled: ["React Patterns", "Microservices"],
            rating: 5,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'd2',
            user: {
                username: 'sarah_m',
                profile: { fullName: 'Sarah Miller', currentRole: 'Product Manager' }
            },
            content: "The Sector Transitions feature is a game-changer. I moved from Retail to EdTech seamlessly by following the skill gap analysis.",
            jobSecured: "Product Lead @ EduStream",
            coursesEnrolled: ["Agile Management", "UX Research"],
            rating: 5,
            createdAt: new Date().toISOString()
        }
    ];

    const dummyLeaderboard = [
        { _id: 'l1', username: 'top_traveler', profile: { fullName: 'Sarah Miller', currentRole: 'Product Lead', streak: 45, points: 2850 } },
        { _id: 'l2', username: 'alex_dev', profile: { fullName: 'Alex Rivera', currentRole: 'Full Stack Dev', streak: 32, points: 2100 } },
        { _id: 'l3', username: 'code_wizard', profile: { fullName: 'Marcus Chen', currentRole: 'Backend Engineer', streak: 28, points: 1950 } },
        { _id: 'l4', username: 'data_pro', profile: { fullName: 'Elena Vogt', currentRole: 'Data Analyst', streak: 15, points: 1200 } }
    ];

    const [reviews, setReviews] = useState(dummyReviews);
    const [leaderboard, setLeaderboard] = useState(dummyLeaderboard);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({ content: '', jobSecured: '', coursesEnrolled: '', rating: 5 });

    useEffect(() => {
        fetchData();
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
                if (res.data && res.data.length > 0) setReviews([...res.data, ...dummyReviews]);
            } else {
                const res = await axios.get('http://localhost:5000/api/community/leaderboard');
                if (res.data && res.data.length > 0) {
                    const combined = [...res.data, ...dummyLeaderboard.filter(d => !res.data.find(r => r.username === d.username))];
                    setLeaderboard(combined.sort((a, b) => (b.profile?.points || 0) - (a.profile?.points || 0)));
                }
            }
        } catch (error) { console.error('Data fetch error:', error); }
    };

    const handleCreateReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const courses = newReview.coursesEnrolled.split(',').map(c => c.trim()).filter(c => c);
            const res = await axios.post('http://localhost:5000/api/community/reviews', { ...newReview, coursesEnrolled: courses }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setReviews([res.data, ...reviews]);
            setShowReviewModal(false);
            setNewReview({ content: '', jobSecured: '', coursesEnrolled: '', rating: 5 });
        } catch (error) { console.error('Review error:', error); } finally { setIsSubmitting(false); }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '120px 20px', background: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(242, 111, 20, 0.08) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(255, 110, 20, 0.05) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Improvised Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(255, 110, 20, 0.08)', borderRadius: '100px', color: '#FF6E14', fontSize: '0.85rem', fontWeight: '800', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            ✨ The Global Talent Network
                        </div>
                        <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: '950',
                            marginBottom: '20px',
                            letterSpacing: '-2.5px',
                            lineHeight: '1',
                            background: 'linear-gradient(135deg, #1E293B 0%, #C2410C 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Community Hub
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 40px', lineHeight: '1.6', fontWeight: '500' }}>
                            Where skill trajectories merge into professional excellence. Join <span style={{ color: '#FF6E14', fontWeight: '700' }}>1,200+</span> travelers reaching their peak.
                        </p>

                        {/* Community Stats Bar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '40px',
                            marginBottom: '50px',
                            flexWrap: 'wrap'
                        }}>
                            {[
                                { label: 'Active Travelers', val: '1.2k+', icon: '👤' },
                                { label: 'Milestones Reached', val: '4.5k+', icon: '🎯' },
                                { label: 'Job Success Rate', val: '88%', icon: '🚀' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    style={{ textAlign: 'center' }}
                                >
                                    <div style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: '900', marginBottom: '4px' }}>{stat.val}</div>
                                    <div style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowReviewModal(true)}
                                style={{
                                    padding: '16px 36px',
                                    background: '#FF6E14',
                                    color: 'white',
                                    borderRadius: '16px',
                                    border: 'none',
                                    fontWeight: '800',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 20px 40px rgba(255, 110, 20, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                Share Your Success ✍️
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Decorative Trajectory Path */}
                    <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', zIndex: -1, opacity: 0.4 }} viewBox="0 0 1000 400">
                        <motion.path
                            d="M0,200 Q250,100 500,200 T1000,200"
                            stroke="url(#gradient-line)"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#F97316" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Glassmorphic Tabs */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    padding: '6px',
                    borderRadius: '16px',
                    width: 'fit-content',
                    margin: '0 auto 4rem',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        style={{
                            padding: '12px 32px',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            background: activeTab === 'reviews' ? '#FFF' : 'transparent',
                            color: activeTab === 'reviews' ? '#FF6E14' : '#64748B',
                            boxShadow: activeTab === 'reviews' ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        Success Stories
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        style={{
                            padding: '12px 32px',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            background: activeTab === 'leaderboard' ? '#FFF' : 'transparent',
                            color: activeTab === 'leaderboard' ? '#FF6E14' : '#64748B',
                            boxShadow: activeTab === 'leaderboard' ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        Leaderboard
                    </button>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'reviews' ? (
                        <motion.div key="reviews" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1E293B' }}>Traveler Wins</h2>
                                {user && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowReviewModal(true)}
                                        style={{ background: '#FF6E14', color: '#FFF', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 110, 20, 0.15)' }}
                                    >
                                        Share My Win
                                    </motion.button>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '24px' }}>
                                {reviews.map((review, idx) => (
                                    <motion.div
                                        key={review._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{
                                            background: '#FFF',
                                            padding: '2rem',
                                            borderRadius: '24px',
                                            border: '1px solid #EEF2F6',
                                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '56px', height: '56px', background: '#EEF2F6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800', color: '#FF6E14' }}>
                                                {review.user?.profile?.fullName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, color: '#1E293B', fontWeight: '800' }}>{review.user?.profile?.fullName}</h4>
                                                <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.85rem', fontWeight: '500' }}>{review.user?.profile?.currentRole}</p>
                                            </div>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} style={{ color: i < review.rating ? '#FBBF24' : '#E2E8F0', fontSize: '0.8rem' }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ color: '#334155', lineHeight: '1.7', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1.5rem' }}>
                                            "{review.content}"
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {review.jobSecured && (
                                                <div style={{ background: '#F0FDF4', color: '#16A34A', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    💼 {review.jobSecured}
                                                </div>
                                            )}
                                            {review.coursesEnrolled?.slice(0, 2).map((c, i) => (
                                                <div key={i} style={{ background: '#EEF2F6', color: '#64748B', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                                                    🎓 {c}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="leaderboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {/* Podium Section */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', marginBottom: '4rem', padding: '0 20px' }}>
                                {/* 2nd Place */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', background: '#F1F5F9', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #CBD5E1', fontSize: '1.2rem' }}>🥈</div>
                                    <div style={{ height: '80px', width: '100px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#64748B', padding: '0 5px', textAlign: 'center', fontSize: '0.85rem' }}>
                                        {leaderboard[1]?.profile?.fullName || leaderboard[1]?.username}
                                    </div>
                                </div>
                                {/* 1st Place */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#FEF3C7', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #FBBF24', fontSize: '1.8rem', perspective: '1000px' }}>🥇</div>
                                    <div style={{ height: '120px', width: '130px', background: 'white', borderRadius: '24px 24px 0 0', boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '950', color: '#FBBF24', fontSize: '1rem', padding: '0 10px', textAlign: 'center' }}>
                                        {leaderboard[0]?.profile?.fullName || leaderboard[0]?.username}
                                    </div>
                                </div>
                                {/* 3rd Place */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', background: '#FFF7ED', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #FB923C', fontSize: '1.2rem' }}>🥉</div>
                                    <div style={{ height: '60px', width: '100px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#92400E', padding: '0 5px', textAlign: 'center', fontSize: '0.8rem' }}>
                                        {leaderboard[2]?.profile?.fullName || leaderboard[2]?.username}
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#FFF', borderRadius: '24px', overflow: 'hidden', border: '1px solid #EEF2F6', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)' }}>
                                {leaderboard.map((entry, idx) => (
                                    <div key={entry._id} style={{ display: 'flex', alignItems: 'center', padding: '20px 32px', borderBottom: idx === leaderboard.length - 1 ? 'none' : '1px solid #F8FAFC', background: idx < 3 ? '#FDFDFF' : 'transparent' }}>
                                        <div style={{ width: '40px', fontWeight: '800', color: idx < 3 ? '#FF6E14' : '#94A3B8' }}>#{idx + 1}</div>
                                        <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px', fontWeight: '800', color: '#FF6E14' }}>
                                            {entry.profile?.fullName?.[0] || 'U'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '800', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {entry.profile?.fullName || entry.username}
                                                {entry._id === user?.id && <span style={{ background: '#FF6E14', color: '#FFF', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px' }}>YOU</span>}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>{entry.profile?.currentRole}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', color: '#1E293B' }}>{entry.profile?.points.toLocaleString()} pts</div>
                                            <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '700' }}>🔥 {entry.profile?.streak}d streak</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Glass Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1E293B', marginBottom: '8px' }}>Share Your Win</h2>
                            <p style={{ color: '#64748B', marginBottom: '2rem', fontWeight: '500' }}>Inspire fellow travelers with your achievements.</p>
                            <form onSubmit={handleCreateReview}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Your Success Story</label>
                                    <textarea required value={newReview.content} onChange={(e) => setNewReview({ ...newReview, content: e.target.value })} placeholder="Tell us how you conquered your goals..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', minHeight: '100px', outline: 'none', fontSize: '0.95rem' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Target Role Secured</label>
                                        <input type="text" value={newReview.jobSecured} onChange={(e) => setNewReview({ ...newReview, jobSecured: e.target.value })} placeholder="e.g. Data Scientist" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Rating</label>
                                        <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}>
                                            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                            <option value="4">⭐⭐⭐⭐ Great</option>
                                            <option value="3">⭐⭐⭐ Good</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button type="button" onClick={() => setShowReviewModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#F1F5F9', color: '#475569', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={isSubmitting} style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#FF6E14', color: '#FFF', fontWeight: '700', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                        {isSubmitting ? 'Sharing...' : 'Post Success'}
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
