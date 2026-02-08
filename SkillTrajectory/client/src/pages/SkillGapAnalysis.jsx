import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const SkillGapAnalysis = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchAnalysis();
        }
    }, [user]);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            // Check for target role passed via navigation state or fallback to saved timeline
            const targetRole = location.state?.targetRole || user?.profile?.savedTimeline?.roleTitle;

            const response = await fetch('http://localhost:5000/api/users/skill-gap-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetRole })
            });
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error('Error fetching skill gap analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        if (priority?.includes('HIGH')) return '#EF4444'; // Red
        if (priority?.includes('MEDIUM')) return '#3B82F6'; // Blue
        return '#10B981'; // Green
    };

    if (loading) {
        return (
            <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8F9FB' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ borderTopColor: '#FF6E14' }}></div>
                    <h2 style={{ marginTop: '20px', fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>Analyzing Skill Gaps...</h2>
                    <p style={{ color: '#666' }}>Comparing your profile against industry standards</p>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Skill Gap Analysis</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Real-time analysis for <span style={{ color: '#FF6E14', fontWeight: '800' }}>{user?.profile?.savedTimeline?.roleTitle || 'Target Role'}</span></p>
                </div>

                {/* Top Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Average Gap */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#828282', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '5px' }}>Average Gap</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1A1A1A' }}>{analysis?.averageGap}%</div>
                            </div>
                            <div style={{ fontSize: '3rem', opacity: 0.8 }}>📊</div>
                        </div>
                    </motion.div>

                    {/* Critical Sprints */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #FF6E14' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#828282', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '5px' }}>Critical Sprints</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1A1A1A' }}>{analysis?.criticalSprints}</div>
                            </div>
                            <div style={{ fontSize: '3rem', opacity: 1 }}>⚡</div>
                        </div>
                    </motion.div>

                    {/* Readiness Score */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#828282', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '5px' }}>Readiness Score</h3>
                                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1A1A1A' }}>{analysis?.readinessScore}%</div>
                            </div>
                            <div style={{ fontSize: '3rem', opacity: 0.8 }}>🎯</div>
                        </div>
                    </motion.div>
                </div>

                {/* Skill Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {analysis?.skills?.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                background: '#FFF',
                                padding: '2rem',
                                borderRadius: '24px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                border: '1px solid #F0F0F0'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '5px' }}>{skill.name}</h3>
                                    <span style={{
                                        color: getPriorityColor(skill.priority),
                                        fontWeight: '800',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {skill.priority}
                                    </span>
                                </div>
                                <div style={{
                                    background: '#ECFDF5',
                                    color: '#10B981',
                                    padding: '6px 12px',
                                    borderRadius: '10px',
                                    fontWeight: '800',
                                    fontSize: '0.85rem'
                                }}>
                                    {skill.gap}% Gap
                                </div>
                            </div>

                            {/* Progress Bars */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                {/* Current Level */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ color: '#828282', fontSize: '0.85rem', fontWeight: '600' }}>Your Level</span>
                                    <span style={{ color: '#1A1A1A', fontWeight: '800', fontSize: '0.9rem' }}>{skill.currentLevel}%</span>
                                </div>
                                <div style={{ height: '6px', background: '#F0F0F0', borderRadius: '3px', marginBottom: '15px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.currentLevel}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        style={{ height: '100%', background: '#3B82F6', borderRadius: '3px' }}
                                    />
                                </div>

                                {/* Target Level */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ color: '#828282', fontSize: '0.85rem', fontWeight: '600' }}>Target Level</span>
                                    <span style={{ color: '#1A1A1A', fontWeight: '800', fontSize: '0.9rem' }}>{skill.targetLevel}%</span>
                                </div>
                                <div style={{ height: '6px', background: '#F0F0F0', borderRadius: '3px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.targetLevel}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        style={{ height: '100%', background: '#10B981', borderRadius: '3px' }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/learning/courses', { state: { targetSkill: skill.name } })}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: '#FF6E14',
                                    color: '#FFF',
                                    border: 'none',
                                    borderRadius: '14px',
                                    fontSize: '1rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    boxShadow: '0 4px 12px rgba(255, 110, 20, 0.2)'
                                }}
                            >
                                Bridge This Gap →
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillGapAnalysis;
