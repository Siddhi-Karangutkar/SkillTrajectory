import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid section-padding">
                    <div className="footer-brand-col">
                        <Link to="/" className="f-logo">
                            SkillTrajectory
                        </Link>
                        <p className="f-desc mt-4">
                            Pioneering the future of professional evolution through deep-learning trajectory modeling.
                        </p>
                        <div className="social-links mt-6">
                            <button onClick={() => alert("Redirecting to X/Twitter...")} className="s-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>𝕏</button>
                            <button onClick={() => alert("Redirecting to LinkedIn...")} className="s-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>in</button>
                            <button onClick={() => alert("Redirecting to GitHub...")} className="s-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>gh</button>
                        </div>
                    </div>

                    <div className="footer-nav-col">
                        <h4>Platform</h4>
                        <ul>
                            <li><Link to="/solution">Methodology</Link></li>
                            <li><Link to="/career/recommendations">Pathfinder</Link></li>
                            <li><Link to="/learning/gap-analysis">Intelligence</Link></li>
                            <li><Link to="/dashboard/trends">Market Trends</Link></li>
                        </ul>
                    </div>

                    <div className="footer-nav-col">
                        <h4>Resources</h4>
                        <ul>
                            <li><Link to="/problem">The Thesis</Link></li>
                            <li><Link to="/learning/courses">Academy</Link></li>
                            <li><Link to="/dashboard/fairness">Transparency</Link></li>
                            <li><Link to="/profile/create">Get Started</Link></li>
                        </ul>
                    </div>

                    <div className="footer-nav-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><button onClick={() => alert("Privacy Protocol details coming soon.")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, font: 'inherit' }}>Privacy Protocol</button></li>
                            <li><button onClick={() => alert("Terms of Service details coming soon.")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, font: 'inherit' }}>Terms of Service</button></li>
                            <li><button onClick={() => alert("Security Audit details coming soon.")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, font: 'inherit' }}>Security Audit</button></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 SkillTrajectory System. All professional rights reserved.</p>
                    <div className="f-bottom-meta">
                        <span>Latency: 24ms</span>
                        <span>v2.1.0-stable</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
