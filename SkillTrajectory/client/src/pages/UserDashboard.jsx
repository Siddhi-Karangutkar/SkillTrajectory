import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/dashboard-data', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="dashboard-loading">Loading Trajectory...</div>;

    // Heatmap Logic
    const generateHeatmapData = () => {
        const today = new Date();
        const days = [];
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const log = data?.activityLogs?.find(l => l.date === dateStr);
            days.push({
                date: dateStr,
                count: log ? log.count : 0
            });
        }
        return days;
    };

    const heatmapDays = generateHeatmapData();

    return (
        <div className="user-dashboard-container">
            <div className="dashboard-content">
                {/* Header Section */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="welcome-text"
                        >
                            Welcome, {data?.fullName.split(' ')[0]}!
                        </motion.h1>
                        <p className="subtitle">You're on a roll! Jump back in, or start something new.</p>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">LOGIN STREAK</span>
                            <div className="stat-value">
                                <span className="number">{data?.streak}</span>
                                <span className="unit">day{data?.streak !== 1 ? 's' : ''}</span>
                            </div>
                            <span className="stat-subtext">current streak 🔥</span>
                        </div>

                        <div className="stat-item">
                            <span className="stat-label">TRAJECTORY XP</span>
                            <div className="stat-value">
                                <span className="number" style={{ color: '#FF6E14' }}>{data?.points}</span>
                                <span className="unit">pts</span>
                            </div>
                            <span className="stat-subtext">total earned</span>
                        </div>

                        <div className="stat-item progress-circle">
                            <span className="stat-label">TIER PROGRESS</span>
                            <div className="circular-progress">
                                <svg width="80" height="80" viewBox="0 0 100 100">
                                    <circle className="bg" cx="50" cy="50" r="40" />
                                    <circle
                                        className="fg"
                                        cx="50" cy="50" r="40"
                                        style={{ strokeDasharray: 251.2, strokeDashoffset: 251.2 - (251.2 * data?.tierProgress) / 100 }}
                                    />
                                </svg>
                                <div className="progress-value">
                                    <span className="percent">{data?.tierProgress}%</span>
                                    <span className="to-label">to {data?.nextTier}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Small Grid */}
                        <div className="stat-item">
                            <span className="stat-label">ACTIVITY</span>
                            <div className="activity-dots">
                                <div className="dot-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
                                <div className="dots-grid">
                                    {[...Array(14)].map((_, i) => (
                                        <div key={i} className={`dot ${i === 11 ? 'active' : ''}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Quick Actions Grid */}
                <section className="quick-actions-grid">
                    <a href="/career/timeline" className="action-card">
                        <div className="card-icon-wrapper" style={{ background: 'rgba(255, 110, 20, 0.1)', color: '#FF6E14' }}>
                            🚀
                        </div>
                        <div>
                            <h3>Career Roadmap</h3>
                            <p>View your 6-phase strategic timeline.</p>
                        </div>
                    </a>
                    <a href="/career/skill-gap" className="action-card">
                        <div className="card-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                            📊
                        </div>
                        <div>
                            <h3>Skill Gaps</h3>
                            <p>Analyze and bridge your missing skills.</p>
                        </div>
                    </a>
                    <a href="/interview/practice" className="action-card">
                        <div className="card-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                            🎤
                        </div>
                        <div>
                            <h3>AI Interview</h3>
                            <p>Practice with Aria, your AI Coach.</p>
                        </div>
                    </a>
                    <a href="/market-trends" className="action-card">
                        <div className="card-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                            📈
                        </div>
                        <div>
                            <h3>Market Trends</h3>
                            <p>Real-time demand and salary data.</p>
                        </div>
                    </a>
                </section>

                {/* Heatmap Section */}
                <section className="heatmap-section">
                    <div className="section-header">
                        <h2>{heatmapDays.reduce((acc, d) => acc + d.count, 0)} contributions in the last year</h2>
                        <span className="settings-link">Contribution settings ▼</span>
                    </div>
                    <div className="heatmap-container">
                        <div className="heatmap-grid">
                            {heatmapDays.map((day, i) => (
                                <div
                                    key={i}
                                    className={`heatmap-cell level-${Math.min(day.count, 4)}`}
                                    title={`${day.count} contributions on ${day.date}`}
                                />
                            ))}
                        </div>
                        <div className="heatmap-legend">
                            <span>Less</span>
                            <div className="legend-cells">
                                <div className="heatmap-cell level-0" />
                                <div className="heatmap-cell level-1" />
                                <div className="heatmap-cell level-2" />
                                <div className="heatmap-cell level-3" />
                                <div className="heatmap-cell level-4" />
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </section>

                {/* Contribution Activity */}
                <section className="activity-section">
                    <h2 className="section-title">Contribution activity</h2>
                    <div className="activity-timeline">
                        {data?.activityLogs && data.activityLogs.length > 0 ? (
                            data.activityLogs.slice(-3).reverse().map((log, lidx) => (
                                <div key={lidx} className="timeline-month-group" style={{ marginBottom: '2rem' }}>
                                    <div className="month-label">{new Date(log.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                                    <div className="timeline-item">
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <span className="action">{log.count} career contributions recorded on {new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                            <div className="repo-list">
                                                <div className="activity-tags">
                                                    {[...new Set(log.activities.map(a => a.type))].map((type, tidx) => (
                                                        <span key={tidx} className="activity-tag">#{type.toLowerCase()}</span>
                                                    ))}
                                                </div>
                                                <div className="commit-counts">
                                                    {[...Array(Math.min(log.count, 5))].map((_, i) => <div key={i} className="commit-bar" style={{ height: `${40 + Math.random() * 60}%` }} />)}
                                                </div>
                                                <span className="commit-total">{log.count} trajectory pts generated</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-activity" style={{ color: '#6B7280', fontSize: '0.9rem' }}>No recent activity. Start your first journey today!</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
