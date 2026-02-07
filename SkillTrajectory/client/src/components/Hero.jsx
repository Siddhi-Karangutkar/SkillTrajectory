import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/image.png';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero section-padding">
            <div className="container hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">
                        Master Your Career Trajectory <span className="highlight">in the AI Era</span>
                    </h1>
                    <p className="hero-subtitle">
                        Don't let skills gap hold you back. Track skill decay, predict your next career move, and bridge learning gaps with AI-driven intelligence.
                    </p>
                    <div className="hero-actions">
                        <Link to="/profile/create" className="btn btn-primary">Start Your Journey</Link>
                        <Link to="/solution" className="btn btn-outline">How it Works</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">85%</span>
                            <span className="stat-label">Jobs Transformed by 2030</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">5yr</span>
                            <span className="stat-label">Average Skill Half-life</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    {/* CSS Background shape removed as image contains it */}

                    <div className="hero-img-container">
                        <img
                            src={heroImage}
                            alt="Career Growth Professionals"
                            className="hero-main-img"
                        />
                    </div>

                    {/* Floating Info Cards */}
                    <div className="floating-card card-match">
                        <div className="fc-icon">🎯</div>
                        <div className="fc-content">
                            <span className="fc-label">Role Fit</span>
                            <span className="fc-value">92% Match</span>
                        </div>
                    </div>

                    <div className="floating-card card-growth">
                        <div className="fc-icon">📈</div>
                        <div className="fc-content">
                            <span className="fc-label">Skill Growth</span>
                            <span className="fc-value">+24% / yr</span>
                        </div>
                    </div>

                    <div className="floating-card card-users">
                        <div className="fc-avatars">
                            <span className="fc-avatar" style={{ background: '#FF6E14' }}></span>
                            <span className="fc-avatar" style={{ background: '#1A1A1A' }}></span>
                            <span className="fc-avatar" style={{ background: '#0056D2' }}></span>
                        </div>
                        <div className="fc-content">
                            <span className="fc-value">10k+</span>
                            <span className="fc-label">Active Learners</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
