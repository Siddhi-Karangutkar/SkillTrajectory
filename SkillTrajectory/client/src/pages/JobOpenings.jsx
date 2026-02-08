import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const JobOpenings = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState(user?.profile?.targetRole || user?.profile?.savedTimeline?.roleTitle || 'Your Target Role');

    useEffect(() => {
        fetchJobOpenings();
    }, []);

    const fetchJobOpenings = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/job-openings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetRole: selectedRole })
            });
            const data = await response.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <motion.button
                            onClick={() => navigate(-1)}
                            whileHover={{ x: -5 }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#FF6E14',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '20px'
                            }}
                        >
                            ← Back to Path
                        </motion.button>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Real-Time Jobs</h1>
                        <p style={{ color: '#666', fontSize: '1.2rem' }}>
                            Personalized opportunities for <span style={{ color: '#FF6E14', fontWeight: '800' }}>{selectedRole}</span>.
                            <span style={{ fontSize: '0.9rem', color: '#828282', display: 'block', marginTop: '5px' }}>
                                ⓘ Applied roles are mapped to live market searches for the most current availability.
                            </span>
                        </p>
                    </div>
                    <div style={{ background: '#FFF', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #EEE' }}>
                        <span style={{ color: '#828282', fontWeight: '700', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>MATCH ACCURACY</span>
                        <span style={{ color: '#1A1A1A', fontWeight: '900', fontSize: '1.5rem' }}>AI-Powered 🎯</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#FF6E14', fontSize: '1.5rem', fontWeight: '900' }}>
                        Scanning Global Job Markets...
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -8 }}
                                style={{
                                    background: '#FFF',
                                    padding: '2.5rem',
                                    borderRadius: '32px',
                                    boxShadow: '0 15px 50px rgba(0,0,0,0.04)',
                                    border: '1px solid #F0F0F0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Match Score Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    background: 'linear-gradient(135deg, #FF6E14, #FF8F4D)',
                                    color: '#FFF',
                                    padding: '12px 20px',
                                    borderBottomLeftRadius: '24px',
                                    fontWeight: '900',
                                    fontSize: '1.1rem'
                                }}>
                                    {job.matchScore}%
                                </div>

                                <div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <span style={{
                                            background: '#FFF0E6',
                                            color: '#FF6E14',
                                            padding: '6px 14px',
                                            borderRadius: '10px',
                                            fontSize: '0.75rem',
                                            fontWeight: '800'
                                        }}>
                                            {job.type}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '8px', paddingRight: '60px' }}>{job.title}</h3>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#666', marginBottom: '20px' }}>{job.company} • {job.location}</div>

                                    <div style={{
                                        background: '#F8F9FB',
                                        padding: '20px',
                                        borderRadius: '20px',
                                        marginBottom: '25px',
                                        borderLeft: '5px solid #FF6E14'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', marginBottom: '8px', textTransform: 'uppercase' }}>Why You Fit</div>
                                        <div style={{ color: '#1A1A1A', fontSize: '1rem', fontWeight: '600', lineHeight: '1.6' }}>{job.whyYouFit}</div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                                        {job.skillsRequired.map((skill, si) => (
                                            <span key={si} style={{
                                                fontSize: '0.8rem',
                                                fontWeight: '800',
                                                color: '#1A1A1A',
                                                background: '#F0F2F5',
                                                padding: '8px 16px',
                                                borderRadius: '12px',
                                                border: '1px solid #E0E0E0'
                                            }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid #F0F0F0',
                                    paddingTop: '25px',
                                    marginTop: 'auto'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase' }}>Est. Salary</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>{job.salary}</div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(job.applyUrl, '_blank')}
                                        style={{
                                            background: '#1A1A1A',
                                            color: '#FFF',
                                            padding: '16px 32px',
                                            borderRadius: '16px',
                                            fontWeight: '800',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Apply Now
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobOpenings;
