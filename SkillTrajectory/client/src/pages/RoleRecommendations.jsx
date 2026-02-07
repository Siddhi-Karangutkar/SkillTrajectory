import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const ROLES_DATASET = [
    {
        id: 'sr-software-eng',
        title: 'Senior Software Engineer',
        category: 'Technology',
        baseSalary: '$120k - $180k',
        whyRole: 'Your strong technical skills and experience align perfectly with this role. Focus on system design to maximize your potential.',
        idealSkills: [
            { name: 'JavaScript', weight: 0.3, idealScore: 90 },
            { name: 'React', weight: 0.25, idealScore: 85 },
            { name: 'Node.js', weight: 0.25, idealScore: 80 },
            { name: 'System Design', weight: 0.2, idealScore: 85 }
        ]
    },
    {
        id: 'fullstack-lead',
        title: 'Full Stack Team Lead',
        category: 'Technology',
        baseSalary: '$130k - $190k',
        whyRole: 'Your leadership skills combined with technical expertise make you a great candidate. Develop architecture knowledge to excel.',
        idealSkills: [
            { name: 'JavaScript', weight: 0.2, idealScore: 90 },
            { name: 'Leadership', weight: 0.3, idealScore: 80 },
            { name: 'Architecture', weight: 0.25, idealScore: 85 },
            { name: 'Mentoring', weight: 0.25, idealScore: 80 }
        ]
    },
    {
        id: 'devops-architect',
        title: 'DevOps Architect',
        category: 'Infrastructure',
        baseSalary: '$140k - $210k',
        whyRole: 'Your infrastructure knowledge is a valuable asset. Mastering automation and cloud scaling will propel you to this senior role.',
        idealSkills: [
            { name: 'Docker', weight: 0.25, idealScore: 90 },
            { name: 'Kubernetes', weight: 0.3, idealScore: 85 },
            { name: 'AWS', weight: 0.25, idealScore: 85 },
            { name: 'CI/CD', weight: 0.2, idealScore: 90 }
        ]
    },
    {
        id: 'product-designer',
        title: 'Senior Product Designer',
        category: 'Design',
        baseSalary: '$110k - $170k',
        whyRole: 'Your eye for UI and understanding of UX psychology makes you a top tier designer. Scale your leadership to manage design systems.',
        idealSkills: [
            { name: 'Figma', weight: 0.3, idealScore: 95 },
            { name: 'User Research', weight: 0.25, idealScore: 80 },
            { name: 'UI Systems', weight: 0.25, idealScore: 90 },
            { name: 'Interaction Design', weight: 0.2, idealScore: 85 }
        ]
    }
];

const RoleRecommendations = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.profile?.skills) {
            calculateRecommendations(user.profile.skills);
        }
    }, [user]);

    const calculateRecommendations = (userSkills) => {
        const processed = ROLES_DATASET.map(role => {
            let totalFit = 0;
            const skillDetails = role.idealSkills.map(ideal => {
                const userSkill = userSkills.find(s => s.name.toLowerCase() === ideal.name.toLowerCase());
                const userScore = userSkill?.score || 0;

                // Calculate contribution to fit
                const contribution = (Math.min(userScore, ideal.idealScore) / ideal.idealScore) * (ideal.weight * 100);
                totalFit += contribution;

                return {
                    name: ideal.name,
                    hasSkill: !!userSkill,
                    isReady: userScore >= (ideal.idealScore * 0.6) // 60% of ideal to be "ready"
                };
            });

            // Calculate prep window (rough heuristic)
            const gap = 100 - totalFit;
            let prepWindow = "3-6 months";
            if (gap > 40) prepWindow = "12-18 months";
            else if (gap > 20) prepWindow = "6-12 months";
            else if (gap < 10) prepWindow = "1-3 months";

            return {
                ...role,
                fitScore: Math.round(totalFit),
                prepWindow,
                skills: skillDetails
            };
        }).sort((a, b) => b.fitScore - a.fitScore);

        setRecommendations(processed);
    };

    const getScoreColor = (score) => {
        if (score >= 85) return '#10B981'; // Green
        if (score >= 70) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                <div style={{ textAlign: 'left', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Career Role Matcher</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>AI-driven recommendations based on your current skill proficiency and market demand.</p>
                </div>

                <div className="recommendation-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {recommendations.map((role) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="role-card"
                            style={{
                                background: '#FFF',
                                padding: '2.5rem',
                                borderRadius: '32px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                                border: '1px solid #F0F0F0',
                                position: 'relative'
                            }}
                        >
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', margin: '0 0 5px 0' }}>{role.title}</h2>
                                    <span style={{ color: '#828282', fontSize: '1rem', fontWeight: '500' }}>{role.category}</span>
                                </div>
                                <div style={{
                                    background: getScoreColor(role.fitScore),
                                    color: '#FFF',
                                    padding: '15px',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    minWidth: '70px',
                                    boxShadow: `0 10px 20px ${getScoreColor(role.fitScore)}25`
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>{role.fitScore}%</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>Fit</div>
                                </div>
                            </div>

                            {/* Salary Badge */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#F8F9FB',
                                padding: '10px 18px',
                                borderRadius: '12px',
                                marginBottom: '2rem'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>💰</span>
                                <span style={{ fontWeight: '700', color: '#1A1A1A' }}>{role.baseSalary}</span>
                            </div>

                            {/* Fit Bar */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ height: '6px', width: '100%', background: '#F0F2F5', borderRadius: '10px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${role.fitScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        style={{ height: '100%', background: getScoreColor(role.fitScore), borderRadius: '10px' }}
                                    />
                                </div>
                                <div style={{ borderBottom: '1px solid #F0F0F0', marginTop: '1.5rem' }}></div>
                            </div>

                            {/* Why this role */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: '#828282', letterSpacing: '1px', marginBottom: '12px' }}>Why This Role?</h4>
                                <p style={{ color: '#4F4F4F', lineHeight: '1.6', fontSize: '1.05rem', margin: 0 }}>
                                    {role.whyRole}
                                </p>
                            </div>

                            {/* Required Skills */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: '#828282', letterSpacing: '1px', marginBottom: '15px' }}>Required Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {role.skills.map((skill, i) => (
                                        <div key={i} style={{
                                            background: skill.isReady ? '#EEFDF5' : '#FFF9F0',
                                            color: skill.isReady ? '#10B981' : '#F59E0B',
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            border: `1px solid ${skill.isReady ? '#D1FAE5' : '#FEF3C7'}`
                                        }}>
                                            {skill.name} {skill.isReady ? '✓' : '⚠️'}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preparation Window */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: '#828282', letterSpacing: '1px', marginBottom: '12px' }}>Preparation Window</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F59E0B', fontWeight: '800' }}>
                                    <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                                    <span>{role.prepWindow} to peak readiness</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={() => navigate('/learning/courses')} className="auth-button" style={{ margin: 0, flex: 1, height: '56px', borderRadius: '14px', fontSize: '1rem' }}>
                                    View Learning Path
                                </button>
                                <button
                                    onClick={() => navigate('/career/timeline', { state: { selectedRole: role } })}
                                    className="btn btn-outline"
                                    style={{ margin: 0, flex: 1, height: '56px', borderRadius: '14px', border: '2px solid #EEE', fontWeight: '800' }}
                                >
                                    See Timeline
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleRecommendations;
