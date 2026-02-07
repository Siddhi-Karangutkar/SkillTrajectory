import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LearningDuration = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState(location.state?.courses || []);
    const [weeklyHours, setWeeklyHours] = useState(10);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch default courses if none passed
    useEffect(() => {
        if (!location.state?.courses && user) {
            fetchDefaultCourses();
        }
    }, [user, location.state]);

    const fetchDefaultCourses = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            // Fetch generic recommended courses for the user
            const response = await fetch('http://localhost:5000/api/users/recommended-courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ filters: { targetSkill: 'Any', provider: 'Any', duration: 'Any' } }) // Default filters
            });
            const data = await response.json();
            if (data.courses) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error('Error fetching default courses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce effect for real-time updates
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user && courses.length > 0) {
                fetchInsights();
            }
        }, 800); // 800ms debounce

        return () => clearTimeout(timer);
    }, [weeklyHours, user, courses]);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/study-velocity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courses, weeklyHours })
            });
            const data = await response.json();
            setInsights(data);
        } catch (error) {
            console.error('Error fetching velocity insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && courses.length === 0) {
        return (
            <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8F9FB' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ borderTopColor: '#FF6E14' }}></div>
                    <p style={{ marginTop: '20px', color: '#666' }}>Loading your learning path...</p>
                </div>
            </div>
        );
    }

    if (courses.length === 0 && !loading) {
        return (
            <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>No courses selected</h2>
                    <p>Please select some courses from the recommendations page first.</p>
                    <button
                        onClick={() => navigate('/learning/courses')}
                        style={{ padding: '12px 24px', marginTop: '20px', background: '#FF6E14', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Go to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Learning Duration & Velocity</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Tune your weekly commitment and see exactly how your path to mastery unfolds.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>

                    {/* Learning Commitment Slider */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A' }}>Learning Commitment</h3>
                            <span style={{ background: '#FFF7ED', color: '#FF6E14', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>PLANNER</span>
                        </div>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '3rem' }}>Adjust your weekly hours to understand how your learning velocity impacts your career transition.</p>

                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: '#828282' }}>
                                <span>VELOCITY SCALE</span>
                                <span style={{ color: '#FF6E14' }}>{weeklyHours} hrs / week</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="1"
                                value={weeklyHours}
                                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    height: '8px',
                                    borderRadius: '4px',
                                    accentColor: '#FF6E14',
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: '#9CA3AF' }}>
                                <span>5h • Standard</span>
                                <span>60h • Intensive</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* AI Learning Insight */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF6E14' }}></div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', letterSpacing: '0.5px' }}>AI LEARNING INSIGHT</span>
                        </div>

                        {loading && !insights ? (
                            <div className="loading-spinner" style={{ borderTopColor: '#FF6E14', width: '24px', height: '24px' }}></div>
                        ) : (
                            <>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '5px' }}>
                                    Strategy: <span style={{ color: '#FF6E14' }}>{insights?.strategy || 'Analyzing...'}</span>
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                                    <div style={{ background: '#F8F9FB', padding: '1rem', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#828282', marginBottom: '5px', textTransform: 'uppercase' }}>Recommended Approach</div>
                                        <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.5' }}>{insights?.advice}</p>
                                    </div>
                                    <div style={{ background: '#F8F9FB', padding: '1rem', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#828282', marginBottom: '5px', textTransform: 'uppercase' }}>Risk Check</div>
                                        <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.5' }}>{insights?.riskCheck?.message}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Growth Benchmarks Section */}
                <div style={{ marginBottom: '4rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Growth Benchmarks</h2>
                        <p style={{ color: '#666', fontSize: '1rem' }}>Track key checkpoints that mark your progress from foundation to peak mastery.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {[
                            { title: 'Quarter Milestone', week: 5, progress: 25, color: '#FF6E14' },
                            { title: 'Core Proficiency', week: 9, progress: 50, color: '#FF6E14' },
                            { title: 'Transition Ready', week: 14, progress: 75, color: '#FF6E14' },
                            { title: 'Peak Mastery', week: 18, progress: 100, color: '#10B981', icon: '🏆' }
                        ].map((benchmark, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '1.5rem' }}>{benchmark.icon || '🎯'}</div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1A1A1A' }}>{benchmark.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#FF6E14', fontWeight: '700' }}>Week {Math.ceil((benchmark.week * 10) / weeklyHours)}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '800', color: '#828282', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    <span>PROGRESS</span>
                                    <span>{benchmark.progress}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#F0F0F0', borderRadius: '4px' }}>
                                    <div style={{ width: `${benchmark.progress}%`, height: '100%', background: benchmark.color, borderRadius: '4px' }}></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Post-Mastery Opportunity */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <div style={{ maxWidth: '60%' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Post-Mastery Opportunity</h2>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>Completing this learning path unlocks eligibility for roles with significant earning potential. Every hour you invest brings that opportunity closer.</p>
                    </div>
                    <div style={{ width: '120px', height: '120px', background: '#E5E7EB', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#FFF', zIndex: 2 }}>+42%</div>
                        <div style={{ fontSize: '0.6rem', fontWeight: '800', color: '#FFF', zIndex: 2, textTransform: 'uppercase' }}>Estimated ROI</div>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#9CA3AF', borderRadius: '50%', opacity: 0.8 }}></div>
                    </div>
                </motion.div>

                {/* Time Allocation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0', marginBottom: '3rem' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '10px' }}>Time Allocation by Track</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>See how your effort distributes across technical, tools, and leadership capabilities.</p>

                    {['Technical', 'Tools', 'Leadership'].map((cat) => {
                        const val = insights?.timeAllocation?.[cat.toLowerCase()] || 0;
                        return (
                            <div key={cat} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: '700', color: '#1A1A1A' }}>{cat}</div>
                                <div style={{ flex: 1, height: '8px', background: '#F0F0F0', borderRadius: '4px', margin: '0 20px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${val}%` }}
                                        transition={{ duration: 0.5 }}
                                        style={{ height: '100%', background: cat === 'Technical' ? '#3B82F6' : cat === 'Tools' ? '#F59E0B' : '#10B981', borderRadius: '4px' }}
                                    />
                                </div>
                                <div style={{ width: '50px', fontSize: '0.85rem', fontWeight: '700', color: '#666', textAlign: 'right' }}>{val}%</div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Backlog Analysis */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Backlog Analysis</h3>
                    <p style={{ color: '#666', fontSize: '1rem' }}>Break down each module to understand effort, duration, and impact on your transition.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {insights?.backlogAnalysis?.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + (idx * 0.1) }}
                            style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1A1A1A' }}>{item.courseTitle.split(' ').slice(0, 3).join(' ')}...</h4>
                                <span style={{ background: '#F3F4F6', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', height: 'fit-content' }}>{item.category}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL EFFORT</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1A1A1A' }}>{item.totalEffort}h</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>EST. DURATION</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1A1A1A' }}>{Math.ceil(item.totalEffort / weeklyHours) || 1} weeks</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: '#828282', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    <span>IMPACT ON PATH</span>
                                    <span>{item.impactOnPath}%</span>
                                </div>
                                <div style={{ height: '6px', background: '#F0F0F0', borderRadius: '3px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.impactOnPath}%` }}
                                        style={{ height: '100%', background: '#FF6E14', borderRadius: '3px' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default LearningDuration;
