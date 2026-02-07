import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Cell
} from 'recharts';

const MarketInsights = () => {
    const demandData = [
        { name: 'AI/ML', value: 95, color: '#FF6E14' },
        { name: 'Cloud', value: 88, color: '#0056D2' },
        { name: 'Cyber', value: 82, color: '#FF6E14' },
        { name: 'DevOps', value: 78, color: '#0056D2' },
        { name: 'Data', value: 85, color: '#FF6E14' },
    ];

    const skillRadarData = [
        { subject: 'Technical', A: 120, fullMark: 150 },
        { subject: 'Strategic', A: 98, fullMark: 150 },
        { subject: 'Creative', A: 86, fullMark: 150 },
        { subject: 'Leadership', A: 99, fullMark: 150 },
        { subject: 'Analytical', A: 85, fullMark: 150 },
    ];

    return (
        <div className="market-insights-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            width: '100%',
            padding: '2rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="insight-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Global Skill Demand (%)</h4>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demandData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={60} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {demandData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="insight-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Market Competency Radar</h4>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                            <PolarRadiusAxis hide />
                            <Radar
                                name="Market Need"
                                dataKey="A"
                                stroke="#FF6E14"
                                fill="#FF6E14"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MarketInsights;
