import React from 'react';
import { Link } from 'react-router-dom';
import HomeAnalytics from './HomeAnalytics';
import './PlatformIntelligence.css';

const PlatformIntelligence = () => {
    const stats = [
        { label: 'Skills Tracked', value: '450k+', icon: '📊' },
        { label: 'Growth Accuracy', value: '94%', icon: '🎯' },
        { label: 'Active Paths', value: '1.2M', icon: '🚀' },
        { label: 'Success Rate', value: '88%', icon: '🏆' }
    ];

    return (
        <section className="platform-intel section-padding">
            <div className="container">
                <div className="intel-grid">
                    <div className="intel-content">
                        <span className="badge-pill">Real-time Intelligence</span>
                        <h2>Data-Driven Career <span className="highlight">Optimization</span></h2>
                        <p className="mb-6">
                            SkillTrajectory leverages a massive database of global employment trends to provide you with a competitive edge.
                            Our algorithms analyze millions of job postings, skill requirements, and career transitions every day.
                        </p>

                        <div className="feature-list mb-8">
                            <div className="feature-item">
                                <div className="fi-icon">⚡</div>
                                <div>
                                    <h5>Dynamic Forecasting</h5>
                                    <p>Predict skill shifts 6-12 months before they hit the mainstream market.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="fi-icon">🔗</div>
                                <div>
                                    <h5>Cross-Sector Mapping</h5>
                                    <p>Discover how your skills in one industry unlock roles in entirely different sectors.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/dashboard/trends" className="btn btn-primary">Explore Market Trends</Link>
                    </div>

                    <div className="intel-analytics-wrapper" style={{ flex: 1 }}>
                        <HomeAnalytics />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlatformIntelligence;
