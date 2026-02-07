import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar, Legend
} from 'recharts';
import './Auth.css';

const CareerSimulator = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Simulation Parameters
    const [targetRole, setTargetRole] = useState('Technical Lead');
    const [learningHours, setLearningHours] = useState(27);
    const [timeHorizon, setTimeHorizon] = useState(5);

    // AI Data State
    const [simData, setSimData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchAISimulation();
        }
    }, [user, targetRole, learningHours, timeHorizon]);

    const fetchAISimulation = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/career-simulation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    parameters: {
                        targetPath: targetRole,
                        learningHours,
                        timeHorizon
                    }
                })
            });
            const data = await response.json();
            setSimData(data);
        } catch (error) {
            console.error('Error fetching AI simulation:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2.5rem' }}>

                    {/* Sidebar Parameters */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: '#FFF',
                            padding: '2.5rem',
                            borderRadius: '32px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                            border: '1px solid #F0F0F0',
                            height: 'fit-content',
                            textAlign: 'left'
                        }}
                    >
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '2rem' }}>Simulation Parameters</h2>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: '#828282', marginBottom: '15px' }}>Target Path</label>
                            <div style={{ display: 'flex', gap: '10px', background: '#F8F9FB', padding: '6px', borderRadius: '16px' }}>
                                {['Technical Lead', 'Engineering Manager'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setTargetRole(role)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 10px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            background: targetRole === role ? '#FFF' : 'transparent',
                                            color: targetRole === role ? '#FF6E14' : '#828282',
                                            boxShadow: targetRole === role ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                        }}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#828282' }}>Learning Investment</label>
                                <span style={{ fontWeight: '900', color: '#FF6E14' }}>{learningHours}h/Week</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={learningHours}
                                onChange={(e) => setLearningHours(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    accentColor: '#FF6E14',
                                    height: '6px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: '#828282', marginBottom: '15px' }}>Time Horizon</label>
                            <select
                                value={timeHorizon}
                                onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '16px',
                                    border: '1px solid #EEE',
                                    background: '#F8F9FB',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            >
                                <option value={3}>3 Years</option>
                                <option value={5}>5 Years</option>
                                <option value={10}>10 Years</option>
                            </select>
                        </div>

                        {simData && (
                            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '2.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '20px' }}>Projected Impact</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ color: '#828282', fontWeight: '600' }}>Salary Upside</span>
                                    <span style={{ color: '#10B981', fontWeight: '900' }}>+{simData.projectedSalaryUpside || simData.salaryUpside}%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#828282', fontWeight: '600' }}>Burnout Risk</span>
                                    <span style={{ color: simData.burnoutRisk === 'Critical' ? '#FF4D4D' : '#FF6E14', fontWeight: '900' }}>{simData.burnoutRisk}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Main Charts Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {loading ? (
                            <div style={{ background: '#FFF', padding: '100px', borderRadius: '32px', textAlign: 'center', color: '#FF6E14', fontSize: '1.5rem', fontWeight: '900' }}>
                                Simulating Career Trajectory...
                            </div>
                        ) : (
                            <>
                                {/* Area Chart: Financial Trajectory */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        background: '#FFF',
                                        padding: '2.5rem',
                                        borderRadius: '32px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                        border: '1px solid #F0F0F0',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', margin: 0 }}>AI-Predicted Financial Trajectory</h2>
                                        <span style={{ color: '#FF6E14', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Groq Intelligence</span>
                                    </div>
                                    <div style={{ height: '350px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={simData?.yearByYearSalaryGrowthData || simData?.trajectoryData}>
                                                <defs>
                                                    <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#FF6E14" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#FF6E14" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                                <XAxis
                                                    dataKey="year"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#828282', fontWeight: 600, fontSize: 12 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#828282', fontWeight: 600, fontSize: 12 }}
                                                    tickFormatter={(value) => `$${value / 1000}k`}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '16px',
                                                        border: 'none',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                        fontWeight: 800
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="salary"
                                                    stroke="#FF6E14"
                                                    strokeWidth={4}
                                                    fillOpacity={1}
                                                    fill="url(#colorSalary)"
                                                    animationDuration={1500}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="baseline"
                                                    stroke="#E0E0E0"
                                                    strokeDasharray="5 5"
                                                    fill="transparent"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 350px', gap: '2.5rem' }}>

                                    {/* Radial Chart: AI Risk */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        style={{
                                            background: '#FFF',
                                            padding: '2.5rem',
                                            borderRadius: '32px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                            border: '1px solid #F0F0F0',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '2rem' }}>AI Displacement Risk Breakdown</h2>
                                        <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadialBarChart
                                                    innerRadius="20%"
                                                    outerRadius="100%"
                                                    data={Object.entries(simData?.detailedAiRiskBreakdown || {}).map(([name, value], i) => ({
                                                        name,
                                                        value,
                                                        fill: ['#FF4D4D', '#FFC107', '#4CAF50', '#2E7D32'][i % 4]
                                                    }))}
                                                    startAngle={180}
                                                    endAngle={0}
                                                >
                                                    <RadialBar
                                                        minAngle={15}
                                                        label={{ fill: '#666', position: 'insideStart', fontSize: '10px', fontWeight: 800 }}
                                                        background
                                                        clockWise={true}
                                                        dataKey='value'
                                                        cornerRadius={10}
                                                    />
                                                    <Tooltip />
                                                    <Legend
                                                        iconSize={10}
                                                        layout='vertical'
                                                        verticalAlign='bottom'
                                                        align="left"
                                                        wrapperStyle={{ paddingTop: '20px' }}
                                                    />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>

                                    {/* Volatility Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        style={{
                                            background: '#FFF',
                                            padding: '2.5rem',
                                            borderRadius: '32px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                            border: '1px solid #F0F0F0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '2rem' }}>Career Volatility</h2>
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            border: '10px solid #F8F9FB',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem',
                                            fontWeight: '900',
                                            color: simData?.volatilityScore === 'Low' ? '#10B981' : '#FFC107',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ fontSize: '0.7rem', color: '#828282', marginBottom: '5px' }}>Score</span>
                                            {simData?.volatilityScore}
                                        </div>
                                        <p style={{ color: '#828282', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                            {simData?.volatilityScore === 'Low'
                                                ? 'Strong immunity against market shifts.'
                                                : 'Higher strategic risk during market shifts.'}
                                        </p>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerSimulator;
