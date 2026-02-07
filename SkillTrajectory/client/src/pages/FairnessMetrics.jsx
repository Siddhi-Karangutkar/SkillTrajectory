import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    PieChart, Pie, Cell
} from 'recharts';

const FairnessMetrics = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMetrics();
        }
    }, [user]);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/fairness-metrics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            console.error('Error fetching fairness metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#FF6E14', '#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

    if (loading) {
        return (
            <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8F9FB' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ borderTopColor: '#FF6E14' }}></div>
                    <h2 style={{ marginTop: '20px', fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>Analyzing Fairness Metrics...</h2>
                    <p style={{ color: '#666' }}>Detecting recommendation bias and parity</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8F9FB', padding: '100px 20px 50px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(255, 110, 20, 0.1)', color: '#FF6E14', padding: '8px 20px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '20px', border: '1px solid rgba(255, 110, 20, 0.2)' }}>
                        ETHICAL AI TRANSPARENCY
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Fairness & Inclusion Metrics</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>Transparent insights into demographic parity, skill accessibility, and algorithmic bias detection within your career trajectory.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginBottom: '3rem' }}>
                    {/* inclusion Index Summary */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '3rem', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '100%', background: 'linear-gradient(90deg, transparent 0%, rgba(255, 110, 20, 0.05) 100%)' }}></div>

                        <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[{ value: metrics?.inclusionIndex }, { value: 100 - metrics?.inclusionIndex }]}
                                        innerRadius={80}
                                        outerRadius={100}
                                        startAngle={180}
                                        endAngle={-180}
                                        dataKey="value"
                                    >
                                        <Cell fill="#FF6E14" />
                                        <Cell fill="#F0F0F0" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A' }}>{metrics?.inclusionIndex}%</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase' }}>Inclusion Index</div>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '15px' }}>Overall Accessibility</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
                                Your inclusion index reflects the accessibility of opportunities and the parity of recommendations compared to industry benchmarks.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>Recommendation Bias</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: metrics?.biasDetection?.recommendationBias < 20 ? '#10B981' : '#F59E0B' }}>
                                        {metrics?.biasDetection?.recommendationBias}%
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '4px' }}>Salary Equity</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1A1A1A' }}>{metrics?.biasDetection?.salaryEquity}%</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Demographic Parity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '2rem' }}>Demographic Parity</h3>
                        {metrics?.demographicParity?.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1A1A1A' }}>{item.category}</span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '800',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: item.status === 'Optimized' ? '#DCFCE7' : item.status === 'Alert' ? '#FEF3C7' : '#FEE2E2',
                                        color: item.status === 'Optimized' ? '#10B981' : item.status === 'Alert' ? '#F59E0B' : '#EF4444'
                                    }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ height: '8px', background: '#F0F0F0', borderRadius: '4px', position: 'relative' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.parityScore}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 + (idx * 0.1) }}
                                        style={{ height: '100%', background: '#FF6E14', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {/* Skill Accessibility Radar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px' }}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '2rem' }}>Resource Accessibility</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart data={metrics?.skillAccessibility || []}>
                                <PolarGrid stroke="#F0F0F0" />
                                <PolarAngleAxis dataKey="subject" stroke="#828282" style={{ fontSize: '0.75rem', fontWeight: '700' }} />
                                <PolarRadiusAxis stroke="#F0F0F0" axisLine={false} tick={false} />
                                <Radar
                                    name="Access"
                                    dataKey="value"
                                    stroke="#FF6E14"
                                    fill="#FF6E14"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Regional Opportunity Mapping */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ background: '#FFF', padding: '2rem', borderRadius: '24px', gridColumn: 'span 2' }}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '2rem' }}>Global Opportunity Mapping</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={metrics?.regionalMapping || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="region" stroke="#828282" axisLine={false} tickLine={false} style={{ fontSize: '0.75rem', fontWeight: '700' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#F8F9FB' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                <Bar
                                    dataKey="opportunity"
                                    fill="#FF6E14"
                                    radius={[10, 10, 0, 0]}
                                    barSize={40}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Bottom Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                    {[
                        { label: 'Advancement Probability', value: '78%', sub: '+4% vs avg', color: '#10B981' },
                        { label: 'Access Score', value: '92/100', sub: 'High liquidity', color: '#3B82F6' },
                        { label: 'Socioeconomic Parity', value: '85%', sub: 'Optimized', color: '#FF6E14' },
                        { label: 'Network Multiplier', value: '2.4x', sub: 'Active growth', color: '#6366F1' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                            style={{ background: '#FFF', padding: '1.5rem', borderRadius: '20px', border: '1px solid #F0F0F0' }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '10px' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '4px' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: stat.color }}>{stat.sub}</div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default FairnessMetrics;
