import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Auth.css';

const SECTORS_DB = [
    {
        id: 'fintech',
        name: 'FinTech',
        icon: '💳',
        description: 'Your technical skills translate well to FinTech. Learn financial domain knowledge to excel.',
        difficulty: 'Medium',
        successRate: '78%',
        expectedUpside: '+15%',
        requiredSkills: ['Financial Systems', 'Compliance', 'Security', 'Data Analysis']
    },
    {
        id: 'healthtech',
        name: 'HealthTech',
        icon: '🏥',
        description: 'Healthcare technology is growing rapidly. Your web development skills are in high demand.',
        difficulty: 'Medium',
        successRate: '72%',
        expectedUpside: '+10%',
        requiredSkills: ['HIPAA Compliance', 'Healthcare Systems', 'Data Privacy', 'HL7 Standards']
    },
    {
        id: 'edtech',
        name: 'EdTech',
        icon: '🎓',
        description: 'Education is undergoing a digital revolution. Your passion for learning bridges the gap.',
        difficulty: 'Low',
        successRate: '85%',
        expectedUpside: '+8%',
        requiredSkills: ['LMS Systems', 'Pedagogy Tech', 'Content Design', 'User Engagement']
    },
    {
        id: 'retailtech',
        name: 'RetailTech',
        icon: '🛍️',
        description: 'Modern commerce needs high-scale architecture. Your backend skills are a perfect fit.',
        difficulty: 'Hard',
        successRate: '65%',
        expectedUpside: '+20%',
        requiredSkills: ['Supply Chain AI', 'Inventory Systems', 'ERP Integration', 'E-commerce Logic']
    }
];

const SectorTransitions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userSkills, setUserSkills] = useState([]);
    const [processedSectors, setProcessedSectors] = useState([]);

    useEffect(() => {
        if (user?.profile?.skills) {
            const skills = user.profile.skills;
            setUserSkills(skills.slice(0, 5));
            calculateTransitions(skills);
        }
    }, [user]);

    const calculateTransitions = (skills) => {
        const skillNames = skills.map(s => s.name.toLowerCase());

        const results = SECTORS_DB.map(sector => {
            // Transferable: High proficiency skills user already has
            const transferable = skills
                .filter(s => s.score > 60)
                .slice(0, 4)
                .map(s => s.name);

            // Bridge: Skills in requiredSkills that user doesn't have in their profile
            const bridge = sector.requiredSkills.filter(
                req => !skillNames.includes(req.toLowerCase())
            ).slice(0, 3);

            // Match score calculation
            const baseMatch = 70;
            const skillBonus = Math.min(skills.length * 2, 15);
            const highProficiencyBonus = skills.filter(s => s.score > 80).length * 2.5;
            const match = Math.min(Math.round(baseMatch + skillBonus + highProficiencyBonus), 98);

            return {
                ...sector,
                match,
                transferableSkills: transferable.length > 0 ? transferable : ['Analytical Thinking', 'Adaptability'],
                bridgeSkills: bridge.length > 0 ? bridge : ['Industry Protocols', 'Domain Frameworks']
            };
        });

        setProcessedSectors(results);
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: '#FFF',
                        padding: '3rem',
                        borderRadius: '32px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                        border: '1px solid #F0F0F0',
                        marginBottom: '4rem',
                        textAlign: 'left'
                    }}
                >
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '2rem' }}>Your Base Industry</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#FFF0E6',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            border: '1px solid #FFE0CC'
                        }}>
                            {user?.profile?.currentRole?.toLowerCase().includes('design') ? '🎨' : '💻'}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '8px' }}>
                                {user?.profile?.currentRole || 'Technology Specialist'}
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {userSkills.map((skill, i) => (
                                    <span key={i} style={{
                                        background: '#F8F9FB',
                                        color: '#666',
                                        padding: '6px 14px',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        border: '1px solid #EEE'
                                    }}>
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Transitions Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(550px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {processedSectors.map((sector, index) => (
                        <motion.div
                            key={sector.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                background: '#FFF',
                                padding: '3rem',
                                borderRadius: '32px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                                border: '1px solid #F0F0F0',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ fontSize: '2rem' }}>{sector.icon}</span>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', margin: 0 }}>{sector.name}</h2>
                                </div>
                                <div style={{
                                    background: '#FF6E14',
                                    color: '#FFF',
                                    padding: '8px 18px',
                                    borderRadius: '12px',
                                    fontWeight: '800',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 8px 20px rgba(255, 110, 20, 0.25)'
                                }}>
                                    {sector.match}% Match
                                </div>
                            </div>

                            <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                                {sector.description}
                            </p>

                            {/* Metrics Section */}
                            <div style={{
                                background: '#F8F9FB',
                                padding: '1.5rem',
                                borderRadius: '24px',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                marginBottom: '3rem',
                                border: '1px solid #F0F0F0'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '8px' }}>Difficulty</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FF6E14' }}>{sector.difficulty}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '8px' }}>Success Rate</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1A1A1A' }}>{sector.successRate}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '8px' }}>Expected Upside</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10B981' }}>{sector.expectedUpside}</div>
                                </div>
                            </div>

                            {/* Skills Comparison */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '3rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#828282', letterSpacing: '1px', marginBottom: '15px' }}>Transferable Base</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {sector.transferableSkills.map((skill, i) => (
                                            <span key={i} style={{
                                                background: '#EEFDF5',
                                                color: '#10B981',
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                fontWeight: '700',
                                                border: '1px solid #D1FAE5'
                                            }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#828282', letterSpacing: '1px', marginBottom: '15px' }}>Bridge Skills Needed</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {sector.bridgeSkills.map((skill, i) => (
                                            <span key={i} style={{
                                                background: '#F0F7FF',
                                                color: '#3B82F6',
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                fontWeight: '700',
                                                border: '1px solid #DBEAFE'
                                            }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/career/timeline', {
                                    state: {
                                        selectedRole: {
                                            title: `${sector.name} Specialist`,
                                            category: sector.name,
                                            skills: sector.bridgeSkills.map(name => ({ name, isReady: false })),
                                            prepWindow: '4-8 months'
                                        }
                                    }
                                })}
                                className="auth-button"
                                style={{ margin: 0, borderRadius: '16px', height: '60px' }}
                            >
                                Analyze Pivot Roadmaps
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectorTransitions;
