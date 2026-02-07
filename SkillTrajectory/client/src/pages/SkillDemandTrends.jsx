import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SkillDemandTrends = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchTrends();
        }
    }, [user]);

    const fetchTrends = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/market-demand-trends', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTrends(data);
        } catch (error) {
            console.error('Error fetching market demand trends:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8F9FB' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ borderTopColor: '#FF6E14' }}></div>
                    <h2 style={{ marginTop: '20px', fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>Analyzing Market Trends...</h2>
                    <p style={{ color: '#666' }}>Gathering real-time skill demand data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Market Demand Trends</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>See which skills are accelerating, stabilizing, or fading in the market.</p>
                </div>

                {/* Key Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {/* Top Skill Growth */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#E0F2FE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔗</div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase' }}>{trends?.keyMetrics?.topSkillGrowth?.skill}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>+{trends?.keyMetrics?.topSkillGrowth?.percentage}%</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '700' }}>↑ {trends?.keyMetrics?.topSkillGrowth?.trend === 'up' ? '+12%' : '-5%'}</div>
                    </motion.div>

                    {/* Average Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📊</div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase' }}>Average skills</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>{trends?.keyMetrics?.averageSkills}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: '700' }}>Per developer</div>
                    </motion.div>

                    {/* Active Jobs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#FFF7ED', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💼</div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase' }}>Active jobs</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>{trends?.keyMetrics?.activeJobs}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: '700' }}>For your profile</div>
                    </motion.div>

                    {/* Job Postings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#DBEAFE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📈</div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase' }}>Job postings</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>{trends?.keyMetrics?.jobPostings?.count}{trends?.keyMetrics?.jobPostings?.unit}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '700' }}>↑ {trends?.keyMetrics?.jobPostings?.trend === 'up' ? '+8%' : '-3%'}</div>
                    </motion.div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Demand Curve */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '10px' }}>Micro Skill Demand Curve</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Real-time demand trends across key technology sectors (2025-2026).</p>

                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={trends?.demandCurve || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                                <XAxis dataKey="month" stroke="#828282" style={{ fontSize: '0.75rem' }} />
                                <YAxis stroke="#828282" style={{ fontSize: '0.75rem' }} />
                                <Tooltip
                                    contentStyle={{ background: '#FFF', border: '1px solid #F0F0F0', borderRadius: '12px', fontSize: '0.85rem' }}
                                />
                                <Line type="monotone" dataKey="demand" stroke="#FF6E14" strokeWidth={3} dot={{ fill: '#FF6E14', r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Top Growth Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '2rem' }}>Top 5 High-Growth Skills</h3>

                        {trends?.topGrowthSkills?.map((skill, idx) => (
                            <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1A1A1A' }}>{skill.name}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#666' }}>{skill.growth}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#F0F0F0', borderRadius: '4px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.growth}%` }}
                                        transition={{ duration: 0.8, delay: 0.6 + (idx * 0.1) }}
                                        style={{ height: '100%', background: `hsl(${20 + (idx * 20)}, 100%, 60%)`, borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Declining Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '2rem' }}>📉 Declining Skills</h3>

                        {trends?.decliningSkills?.map((skill, idx) => (
                            <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1A1A1A' }}>{skill.name}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#EF4444' }}>{skill.decline}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#F0F0F0', borderRadius: '4px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.abs(skill.decline)}%` }}
                                        transition={{ duration: 0.8, delay: 0.7 + (idx * 0.1) }}
                                        style={{ height: '100%', background: '#EF4444', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Trending Skills */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '5px' }}>✨ Trending Skills</h2>
                            <p style={{ color: '#666', fontSize: '1rem' }}>Skills with the highest market momentum right now.</p>
                        </div>
                        <button onClick={() => navigate('/learning/courses')} style={{ padding: '10px 20px', background: '#FF6E14', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}>
                            🔥 Explore Skills
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {trends?.trendingSkills?.map((skill, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + (idx * 0.1) }}
                                style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0', position: 'relative' }}
                            >
                                {skill.trend === 'hot' && (
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#EF4444', color: '#FFF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' }}>
                                        🔥 HOT
                                    </div>
                                )}

                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '5px' }}>{skill.name}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem' }}>{skill.category}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>OPEN ROLES</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1A1A1A' }}>{skill.jobCount}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>AVG SALARY</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1A1A1A' }}>{skill.avgSalary}{skill.salaryUnit}</div>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/learning/courses', { state: { targetSkill: skill.name } })} style={{ width: '100%', padding: '10px', background: '#F8F9FB', border: '1px solid #E5E7EB', borderRadius: '10px', fontWeight: '700', color: '#1A1A1A', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    View Insights →
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Market Positioning */}
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '5px' }}>Your Market Positioning</h2>
                        <p style={{ color: '#666', fontSize: '1rem' }}>Compare your current skill levels against market opportunities for each tech area.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {trends?.marketPositioning?.map((position, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + (idx * 0.1) }}
                                style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '5px' }}>{position.skill}</h4>
                                        <span style={{
                                            background: position.userLevel === 'Advanced' ? '#DCFCE7' : position.userLevel === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                                            color: position.userLevel === 'Advanced' ? '#10B981' : position.userLevel === 'Intermediate' ? '#F59E0B' : '#EF4444',
                                            padding: '4px 10px',
                                            borderRadius: '10px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800'
                                        }}>
                                            {position.userLevel}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase' }}>MARKET DEMAND</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FF6E14' }}>{position.marketDemand}%</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>OPEN ROLES</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1A1A1A' }}>{position.jobCount}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>AVG SALARY</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1A1A1A' }}>{position.avgSalary}{position.salaryUnit}</div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: '#828282', marginBottom: '8px', textTransform: 'uppercase' }}>
                                        <span>GAP-TO-DOOR</span>
                                        <span>{position.gapToDoor}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#F0F0F0', borderRadius: '3px' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${position.gapToDoor}%` }}
                                            transition={{ duration: 0.8, delay: 1 + (idx * 0.1) }}
                                            style={{ height: '100%', background: position.gapToDoor > 70 ? '#10B981' : position.gapToDoor > 40 ? '#F59E0B' : '#EF4444', borderRadius: '3px' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '4rem' }}>
                    <button onClick={() => navigate('/learning/gap-analysis')} style={{ padding: '14px 28px', background: '#FF6E14', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 14px rgba(255, 110, 20, 0.3)' }}>
                        Analyze Skill Trends →
                    </button>
                    <button onClick={() => navigate('/learning/courses')} style={{ padding: '14px 28px', background: '#FFF', color: '#1A1A1A', border: '2px solid #E5E7EB', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem' }}>
                        See Skill Recommendations
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SkillDemandTrends;
