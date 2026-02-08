import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const SkillWastage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWastageJobs();
    }, []);

    const fetchWastageJobs = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/skill-wastage-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error fetching wastage jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', padding: '120px 20px', background: '#F0F9F4' }}>
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
                                color: '#059669',
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
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#064E3B', marginBottom: '10px' }}>Skill Wastage</h1>
                        <p style={{ color: '#374151', fontSize: '1.2rem' }}>
                            Discover <span style={{ color: '#059669', fontWeight: '800' }}>Govt & NGO</span> opportunities that value your underutilized micro-skills.
                            <span style={{ fontSize: '0.9rem', color: '#6B7280', display: 'block', marginTop: '5px' }}>
                                ⓘ We analyze your unique skill combination to find roles where you can make maximum social impact.
                            </span>
                        </p>
                    </div>
                    <div style={{ background: '#FFF', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #D1FAE5' }}>
                        <span style={{ color: '#6B7280', fontWeight: '700', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>IMPACT POTENTIAL</span>
                        <span style={{ color: '#064E3B', fontWeight: '900', fontSize: '1.5rem' }}>High Impact 🌍</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#059669', fontSize: '1.5rem', fontWeight: '900' }}>
                        Scanning Social Impact Opportunities...
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
                                    boxShadow: '0 15px 50px rgba(5, 150, 105, 0.05)',
                                    border: '1px solid #E1F8EB',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Impact Score Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    background: 'linear-gradient(135deg, #059669, #10B981)',
                                    color: '#FFF',
                                    padding: '12px 20px',
                                    borderBottomLeftRadius: '24px',
                                    fontWeight: '900',
                                    fontSize: '1.1rem'
                                }}>
                                    {job.impactScore}%
                                </div>

                                <div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <span style={{
                                            background: '#D1FAE5',
                                            color: '#047857',
                                            padding: '6px 14px',
                                            borderRadius: '10px',
                                            fontSize: '0.75rem',
                                            fontWeight: '800'
                                        }}>
                                            {job.sector}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#064E3B', marginBottom: '8px', paddingRight: '60px' }}>{job.title}</h3>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#4B5563', marginBottom: '20px' }}>{job.organization} • {job.location}</div>

                                    <div style={{
                                        background: '#F0FDF4',
                                        padding: '20px',
                                        borderRadius: '20px',
                                        marginBottom: '25px',
                                        borderLeft: '5px solid #10B981'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase' }}>Social Resonance</div>
                                        <div style={{ color: '#064E3B', fontSize: '1rem', fontWeight: '600', lineHeight: '1.6' }}>{job.whyYouFit}</div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                                        {job.skillsValued.map((skill, si) => (
                                            <span key={si} style={{
                                                fontSize: '0.8rem',
                                                fontWeight: '800',
                                                color: '#064E3B',
                                                background: '#ECFDF5',
                                                padding: '8px 16px',
                                                borderRadius: '12px',
                                                border: '1px solid #A7F3D0'
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
                                    borderTop: '1px solid #E1F8EB',
                                    paddingTop: '25px',
                                    marginTop: 'auto'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' }}>Salary / Grade</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#064E3B' }}>{job.salary}</div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(job.applyUrl, '_blank')}
                                        style={{
                                            background: '#065F46',
                                            color: '#FFF',
                                            padding: '16px 32px',
                                            borderRadius: '16px',
                                            fontWeight: '800',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 20px rgba(6, 95, 70, 0.2)'
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

export default SkillWastage;
