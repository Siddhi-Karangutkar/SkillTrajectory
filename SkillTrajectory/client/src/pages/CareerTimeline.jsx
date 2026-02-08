import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const CareerTimeline = () => {
    const { user, updateProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [timelineNodes, setTimelineNodes] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(false);

    useEffect(() => {
        if (location.state?.selectedRole) {
            const role = location.state.selectedRole;
            setSelectedRole(role);
            fetchAITimeline(role);
        } else if (user?.profile?.savedTimeline) {
            const saved = user.profile.savedTimeline;
            setSelectedRole({
                title: saved.roleTitle || 'Professional',
                id: saved.roleId
            });
            if (saved.nodes && saved.nodes.length > 0) {
                setTimelineNodes(saved.nodes);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [location.state, user?.profile?.savedTimeline]);

    const fetchJobOpenings = () => {
        navigate('/career/jobs');
    };

    const fetchAITimeline = async (role) => {
        try {
            setLoading(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/career-insights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetRole: role.title || role.name })
            });
            const data = await response.json();

            // The AI returns a "roadmap" array usually, or we can map its response to nodes
            // Let's assume the AI returns an object with a 'roadmap' field based on prompt
            const nodes = (data.roadmap || data.phases || []).map((phase, i) => ({
                label: phase.label || `Phase ${i + 1}`,
                title: phase.title || 'Career Milestone',
                subtitle: phase.subtitle || 'Skill Development',
                status: i === 0 ? 'CURRENT' : 'UPCOMING',
                description: phase.description || 'Focusing on strategic skills for the next level.',
                skills: phase.skills || [],
                duration: phase.duration || 'Flexible'
            }));

            if (nodes.length > 0) {
                setTimelineNodes(nodes);
            } else if (data.phases) {
                // Backup if it's named 'phases'
                setTimelineNodes(data.phases);
            }
        } catch (error) {
            console.error('Error fetching AI timeline:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTimeline = async () => {
        try {
            setIsSaving(true);
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    savedTimeline: {
                        roleTitle: selectedRole?.title || selectedRole?.name,
                        roleId: selectedRole?.id,
                        nodes: timelineNodes,
                        savedAt: new Date()
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                updateProfile(data.profile);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error saving timeline:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateNodeStatus = async (index, newStatus) => {
        try {
            const token = user?.token;
            const response = await fetch('http://localhost:5000/api/users/timeline/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nodeIndex: index, status: newStatus })
            });

            if (response.ok) {
                const updatedTimeline = await response.json();
                setTimelineNodes(updatedTimeline.nodes);
                // Also update user profile in context if it's there
                const userRes = await fetch('http://localhost:5000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userRes.json();
                updateProfile(userData.profile);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', textAlign: 'left' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Career GPS</h1>
                        <p style={{ color: '#666', fontSize: '1.2rem' }}>
                            Strategic roadmap to <span style={{ color: '#FF6E14', fontWeight: '800' }}>{selectedRole?.title || selectedRole?.name || 'your target role'}</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={fetchJobOpenings}
                            disabled={loadingJobs}
                            className="auth-button"
                            style={{
                                margin: 0,
                                width: '200px',
                                height: '56px',
                                borderRadius: '14px',
                                background: '#FFF',
                                color: '#1A1A1A',
                                border: '2px solid #EEE'
                            }}
                        >
                            {loadingJobs ? 'Searching...' : 'View Job Openings'}
                        </button>
                        {(timelineNodes.length > 0) && (
                            <button
                                onClick={handleSaveTimeline}
                                disabled={isSaving}
                                className="auth-button"
                                style={{
                                    margin: 0,
                                    width: '200px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    background: saveSuccess ? '#10B981' : '#1A1A1A'
                                }}
                            >
                                {isSaving ? 'Saving...' : saveSuccess ? '✓ Saved' : 'Save Roadmap'}
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#FF6E14', fontSize: '1.5rem', fontWeight: '900' }}>
                        Mapping AI Career Roadmap...
                    </div>
                ) : timelineNodes.length > 0 ? (
                    <div style={{ position: 'relative', paddingLeft: '40px' }}>
                        {/* The Line */}
                        <div style={{
                            position: 'absolute',
                            left: '7px',
                            top: '40px',
                            bottom: '40px',
                            width: '2px',
                            background: 'linear-gradient(to bottom, #FF6E14, #FFE0CC)',
                            borderRadius: '2px'
                        }} />

                        {timelineNodes.map((node, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ position: 'relative', marginBottom: '4.5rem', textAlign: 'left' }}
                            >
                                {/* Node Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-40px',
                                    top: '5px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: node.status === 'CURRENT' ? '#FF6E14' : '#FFF',
                                    border: '3px solid #FF6E14',
                                    zIndex: 2,
                                    boxShadow: node.status === 'CURRENT' ? '0 0 20px rgba(255,110,20,0.4)' : 'none'
                                }}>
                                    {node.status === 'CURRENT' && (
                                        <motion.div
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            style={{
                                                position: 'absolute',
                                                top: '-6px',
                                                left: '-6px',
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '50%',
                                                border: '2px solid #FF6E14'
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Content Card */}
                                <div style={{
                                    background: '#FFF',
                                    padding: '2.5rem',
                                    borderRadius: '28px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                    border: '1px solid #F0F0F0'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <span style={{
                                            background: '#FFF0E6',
                                            color: '#FF6E14',
                                            padding: '6px 14px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase'
                                        }}>
                                            {node.label}
                                        </span>
                                        <span style={{ color: '#828282', fontWeight: '700', fontSize: '0.9rem' }}>{node.duration}</span>
                                    </div>

                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '8px' }}>{node.title}</h3>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FF6E14', marginBottom: '18px' }}>{node.subtitle}</h4>

                                    <p style={{ color: '#666', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '25px' }}>
                                        {node.description}
                                    </p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
                                        {node.skills && node.skills.map((skill, si) => (
                                            <span key={si} style={{
                                                background: '#F8F9FB',
                                                color: '#1A1A1A',
                                                padding: '8px 16px',
                                                borderRadius: '12px',
                                                fontSize: '0.9rem',
                                                fontWeight: '800',
                                                border: '1px solid #EEE'
                                            }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid #F0F0F0' }}>
                                        {node.status !== 'COMPLETED' ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateNodeStatus(index, 'COMPLETED')}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: '10px',
                                                        background: '#10B981',
                                                        color: '#FFF',
                                                        border: 'none',
                                                        fontWeight: '700',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Mark as Complete (+100 XP)
                                                </button>
                                                {node.status !== 'CURRENT' && (
                                                    <button
                                                        onClick={() => handleUpdateNodeStatus(index, 'CURRENT')}
                                                        style={{
                                                            padding: '10px 20px',
                                                            borderRadius: '10px',
                                                            background: '#FFF',
                                                            color: '#FF6E14',
                                                            border: '2px solid #FF6E14',
                                                            fontWeight: '700',
                                                            fontSize: '0.9rem',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Set as Current
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: '800' }}>
                                                <span>✓ Milestone Achievement Unlocked</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', background: '#FFF', borderRadius: '32px' }}>
                        <h2 style={{ color: '#1A1A1A', fontWeight: '900' }}>No active trajectory</h2>
                        <p style={{ color: '#828282' }}>Select a role from the Career Recommendations to begin.</p>
                        <button onClick={() => navigate('/career/recommendations')} className="auth-button" style={{ width: '250px', marginTop: '20px' }}>
                            Explore Roles
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerTimeline;
