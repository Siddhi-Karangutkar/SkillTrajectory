import React from 'react';
import { Link } from 'react-router-dom';
import './CTASection.css';

const CTASection = () => {
    return (
        <section className="cta-section section-padding">
            <div className="container">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2>Ready to Own Your <span className="highlight">Trajectory?</span></h2>
                        <p>Join thousands of professionals who are future-proofing their careers today.</p>
                    </div>
                    <div className="cta-actions">
                        <Link to="/profile/create" className="btn btn-primary">Create Profile Free</Link>
                        <Link to="/problem" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Why it Matters</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
