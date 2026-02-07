import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

const HomeAnalytics = () => {
    const data = [
        { name: 'Month 1', value: 400 },
        { name: 'Month 2', value: 300 },
        { name: 'Month 3', value: 600 },
        { name: 'Month 4', value: 800 },
        { name: 'Month 5', value: 500 },
        { name: 'Month 6', value: 900 },
    ];

    return (
        <div className="home-analytics" style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            height: '100%',
            minHeight: '400px'
        }}>
            <h4 style={{ marginBottom: '1.5rem', color: '#1A1A1A' }}>Market Demand Projection</h4>
            <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF6E14" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#FF6E14" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#FF6E14"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', color: '#828282', fontSize: '0.85rem' }}>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
            </div>
        </div>
    );
};

export default HomeAnalytics;
