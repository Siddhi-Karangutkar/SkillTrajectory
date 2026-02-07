import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const SkillDecay = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEnvironment, setSelectedEnvironment] = useState('Modern Analytics');

    useEffect(() => {
        if (user) {
            fetchAnalysis();
        }
    }, [user]);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/skill-decay-analysis', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAnalysis(data);
            if (data?.environments?.length > 0) {
                setSelectedEnvironment(data.environments[0].name);
            }
        } catch (error) {
            console.error('Error fetching skill decay analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8F9FB' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ borderTopColor: '#FF6E14' }}></div>
                    <h2 style={{ marginTop: '20px', fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>Analyzing Skill Decay...</h2>
                    <p style={{ color: '#666' }}>Calculating contextual half-life</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8F9FB', padding: '100px 20px 50px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Contextual Skill Half-Life</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Visualize how your technical expertise decays differently across specific industries and roles.</p>
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Aggregate Proficiency Trend */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '20px' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '10px' }}>Aggregate Proficiency Trend</h3>
                        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '2rem' }}>Your overall skill level over the last 6 months</p>

                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={analysis?.aggregateTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                                <XAxis dataKey="month" stroke="#828282" style={{ fontSize: '0.75rem' }} />
                                <YAxis stroke="#828282" style={{ fontSize: '0.75rem' }} />
                                <Tooltip contentStyle={{ background: '#FFF', border: '1px solid #F0F0F0', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="proficiency" stroke="#FF6E14" strokeWidth={3} dot={{ fill: '#FF6E14', r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Knowledge Integrity Matrix */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '20px' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '10px' }}>Knowledge Integrity Matrix</h3>
                        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '2rem' }}>Balance between Tech, Business, and Current Context</p>

                        <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={[
                                { subject: 'Tech', value: analysis?.knowledgeMatrix?.tech || 50 },
                                { subject: 'Business', value: analysis?.knowledgeMatrix?.business || 50 },
                                { subject: 'Context', value: analysis?.knowledgeMatrix?.context || 50 }
                            ]}>
                                <PolarGrid stroke="#F0F0F0" />
                                <PolarAngleAxis dataKey="subject" stroke="#828282" style={{ fontSize: '0.85rem' }} />
                                <PolarRadiusAxis stroke="#828282" />
                                <Radar name="Knowledge" dataKey="value" stroke="#FF6E14" fill="#FF6E14" fillOpacity={0.3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Why Half-Life Matters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ background: 'linear-gradient(135deg, #FF6E14 0%, #FF8C42 100%)', padding: '2rem', borderRadius: '20px', marginBottom: '3rem', borderLeft: '4px solid #FFF' }}
                >
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#FFF', marginBottom: '10px' }}>Why Half-Life Matters</h2>
                    <p style={{ color: '#FFF', fontSize: '1rem', lineHeight: '1.6', opacity: 0.95 }}>
                        Skill decay is <strong>not global</strong>. IT's <strong>contextual</strong>. A skill may be ultra-alive in one sector but obsolete in another. SQL, for legacy systems has a slow decay, while SQL for modern high-scale analytics erodes rapidly as new standards emerge. Use the selector below to calibrate your specific operational environment.
                    </p>
                </motion.div>

                {/* Environment Selector */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '1.5rem' }}>Select Your Environment</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {analysis?.environments?.map((env, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedEnvironment(env.name)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    background: selectedEnvironment === env.name ? '#FF6E14' : '#FFF',
                                    color: selectedEnvironment === env.name ? '#FFF' : '#1A1A1A',
                                    border: selectedEnvironment === env.name ? '2px solid #FF6E14' : '2px solid #E5E7EB',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                }}
                            >
                                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '5px' }}>ENVIRONMENT</div>
                                <div style={{ fontSize: '1rem', fontWeight: '800' }}>{env.name}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Skill Decay Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {analysis?.skillDecay?.map((skill, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        >
                            {/* Skill Header */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '5px' }}>{skill.name}</h4>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    background: skill.environmentMetrics?.[selectedEnvironment]?.status === 'LEARN_OBSOLESCENCE' ? '#FEE2E2' : skill.environmentMetrics?.[selectedEnvironment]?.status === 'EVIDENT_ATROPHY' ? '#FEF3C7' : '#DCFCE7',
                                    color: skill.environmentMetrics?.[selectedEnvironment]?.status === 'LEARN_OBSOLESCENCE' ? '#EF4444' : skill.environmentMetrics?.[selectedEnvironment]?.status === 'EVIDENT_ATROPHY' ? '#F59E0B' : '#10B981'
                                }}>
                                    {skill.environmentMetrics?.[selectedEnvironment]?.status?.replace(/_/g, ' ') || 'NEUTRAL'}
                                </div>
                            </div>

                            {/* Decay Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>CONTEXTUAL RATE</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>{skill.environmentMetrics?.[selectedEnvironment]?.currentRate}% / Qtr</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>EST. HALF-LIFE</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>{skill.environmentMetrics?.[selectedEnvironment]?.halfLife}</div>
                                </div>
                            </div>

                            {/* Decay Trend Chart */}
                            <ResponsiveContainer width="100%" height={100}>
                                <LineChart data={skill.environmentMetrics?.[selectedEnvironment]?.decayTrend?.map(val => ({ value: val })) || []}>
                                    <Line type="monotone" dataKey="value" stroke={skill.environmentMetrics?.[selectedEnvironment]?.status === 'LEARN_OBSOLESCENCE' ? '#EF4444' : skill.environmentMetrics?.[selectedEnvironment]?.status === 'EVIDENT_ATROPHY' ? '#F59E0B' : '#3B82F6'} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>

                            {/* Content Integrity */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: '#828282', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    <span>Content Integrity</span>
                                    <span style={{ color: '#FF6E14' }}>{skill.contentIntegrity}%</span>
                                </div>
                                <div style={{ height: '6px', background: '#F0F0F0', borderRadius: '3px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.contentIntegrity}%` }}
                                        transition={{ duration: 0.8, delay: 0.5 + (idx * 0.1) }}
                                        style={{ height: '100%', background: '#FF6E14', borderRadius: '3px' }}
                                    />
                                </div>
                            </div>

                            {/* Emergency Refresh */}
                            <button
                                onClick={() => navigate('/learning/courses', { state: { targetSkill: skill.name } })}
                                style={{ width: '100%', padding: '12px', background: '#FF6E14', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Emergency Refresh
                            </button>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SkillDecay;
