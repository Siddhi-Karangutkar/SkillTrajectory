import React from 'react';
import { Link } from 'react-router-dom';
import './PlatformSteps.css';

const PlatformSteps = () => {
    const steps = [
        {
            number: '01',
            title: 'Map Your DNA',
            desc: 'Create a deep-learning profile that captures your skills, experiences, and hidden potential.',
            path: '/profile/create',
            btn: 'Start Profiling'
        },
        {
            number: '02',
            title: 'Identify Gaps',
            desc: 'Our AI compares your profile with target trajectories to find skill gaps and market decay.',
            path: '/learning/gap-analysis',
            btn: 'View Analytics'
        },
        {
            number: '03',
            title: 'Own Your Path',
            desc: 'Execute personalized learning sprints and transition into your next high-reward role.',
            path: '/career/recommendations',
            btn: 'Get Recommendations'
        }
    ];

    return (
        <section className="platform-steps section-padding">
            <div className="container">
                <div className="section-header text-center mb-8">
                    <span className="badge-pill">The Process</span>
                    <h2>Three Stages to <span className="highlight">Career Transcendence</span></h2>
                    <p>Our methodology focuses on granular skill evolution and precision matching.</p>
                </div>

                <div className="steps-grid">
                    {steps.map((s, i) => (
                        <div className="step-card" key={i}>
                            <div className="step-meta">
                                <span className="step-number">{s.number}</span>
                                <div className="step-line"></div>
                            </div>
                            <div className="step-content">
                                <h3>{s.title}</h3>
                                <p className="mb-4">{s.desc}</p>
                                <Link to={s.path} className="btn-text">
                                    {s.btn} <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformSteps;
