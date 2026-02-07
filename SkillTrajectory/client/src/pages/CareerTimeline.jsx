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

    useEffect(() => {
        console.log('User Profile savedTimeline:', user?.profile?.savedTimeline);
        console.log('Location State selectedRole:', location.state?.selectedRole);

        if (location.state?.selectedRole) {
            const role = location.state.selectedRole;
            setSelectedRole(role);
            generateTimeline(role);
        } else if (user?.profile?.savedTimeline) {
            const saved = user.profile.savedTimeline;
            setSelectedRole({
                title: saved.roleTitle || 'Professional',
                id: saved.roleId
            });
            if (saved.nodes && saved.nodes.length > 0) {
                setTimelineNodes(saved.nodes);
            }
        }
    }, [location.state, user?.profile?.savedTimeline]);

    const generateTimeline = (role) => {
        const readySkills = role.skills.filter(s => s.isReady).map(s => s.name);
        const gapSkills = role.skills.filter(s => !s.isReady).map(s => s.name);

        // Split gap skills for more granular steps
        const midGap = Math.ceil(gapSkills.length / 2);
        const phase1Gap = gapSkills.slice(0, midGap);
        const phase2Gap = gapSkills.slice(midGap);

        const nodes = [
            {
                label: 'Phase 1: Now',
                title: 'Current Foundations',
                subtitle: user?.profile?.currentRole || 'Skill Baseline',
                status: 'CURRENT',
                description: 'Leveraging your current strengths while stabilizing core competencies. Setting the stage for deep technical dives.',
                skills: readySkills.length > 0 ? readySkills : ['Core Fundamentals'],
                duration: 'Present'
            },
            {
                label: 'Phase 2: Core Mastery (1-3 months)',
                title: 'Technical Deep-Dive',
                subtitle: 'Bridging the Primary Gaps',
                status: 'UPCOMING',
                description: `Focused intensive learning on ${phase1Gap.join(', ') || 'essential frameworks'}. Building high proficiency in core requirements.`,
                skills: phase1Gap.length > 0 ? phase1Gap : ['Primary Specialized Skills'],
                duration: '1-3 months'
            },
            {
                label: 'Phase 3: Advanced Architecting (3-6 months)',
                title: 'Specialization & Scale',
                subtitle: 'Mastering the Ecosystem',
                status: 'UPCOMING',
                description: `Expanding knowledge into ${phase2Gap.join(', ') || 'advanced patterns'}. Understanding complex inter-dependencies and optimization.`,
                skills: phase2Gap.length > 0 ? phase2Gap : ['Advanced Ecosystem Tools'],
                duration: '3-6 months'
            },
            {
                label: 'Phase 4: Real-world Application',
                title: 'Portfolio & Project Sprint',
                subtitle: 'Validation through Implementation',
                status: 'UPCOMING',
                description: `Building production-grade projects using the full ${role.title} stack. Simulating industry challenges and performance tuning.`,
                skills: [...gapSkills.slice(-2), 'Project Delivery'],
                duration: '6-8 months'
            },
            {
                label: 'Phase 5: Market Readiness',
                title: 'Interview & Branding',
                subtitle: 'Final Polish',
                status: 'UPCOMING',
                description: 'Optimizing professional presence. Technical interview simulations and system design assessments.',
                skills: ['System Design', 'Behavioral Mastery', 'Portfolio Review'],
                duration: '8-10 months'
            },
            {
                label: 'Final Goal: Peak Performance',
                title: `Entry: ${role.title}`,
                subtitle: 'Professional Excellence',
                status: 'UPCOMING',
                description: `Transitioning into the ${role.category} sector as a high-impact contributor with a complete strategic skillset.`,
                skills: role.skills.map(s => s.name),
                duration: 'Target'
            }
        ];
        setTimelineNodes(nodes);
    };

    const handleSaveTimeline = async () => {
        if (!selectedRole || timelineNodes.length === 0) return;

        setIsSaving(true);
        try {
            await updateProfile({
                savedTimeline: {
                    roleId: selectedRole.id,
                    roleTitle: selectedRole.title,
                    nodes: timelineNodes
                }
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save timeline:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'CURRENT':
                return {
                    bg: '#EEFDF5',
                    color: '#10B981',
                    dot: '#FF6E14',
                    border: '#FF6E14'
                };
            case 'UPCOMING':
                return {
                    bg: '#F0F7FF',
                    color: '#3B82F6',
                    dot: '#E0E0E0',
                    border: '#E0E0E0'
                };
            default:
                return { bg: '#F8F9FB', color: '#666', dot: '#E0E0E0', border: '#E0E0E0' };
        }
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px' }}>Career Trajectory</h1>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>Your personalized roadmap to becoming a <strong>{selectedRole?.title || 'Expert'}</strong>.</p>
                    </div>

                    {!user?.profile?.savedTimeline || user.profile.savedTimeline.roleId !== selectedRole?.id ? (
                        <button
                            onClick={handleSaveTimeline}
                            className="auth-button"
                            disabled={isSaving || !selectedRole}
                            style={{ margin: 0, width: 'auto', padding: '0 30px', height: '56px', borderRadius: '16px' }}
                        >
                            {isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save This Timeline'}
                        </button>
                    ) : (
                        <div style={{ color: '#10B981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>✓</span> Active Trajectory
                        </div>
                    )}
                </div>

                <div className="timeline-container" style={{ position: 'relative', paddingLeft: '80px' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '40px',
                        top: '0',
                        bottom: '0',
                        width: '4px',
                        background: '#FFE0CC',
                        borderRadius: '10px'
                    }}>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            style={{ width: '100%', background: '#FF6E14', borderRadius: '10px' }}
                        />
                    </div>

                    {/* Timeline Nodes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {timelineNodes.map((node, index) => {
                            const styles = getStatusStyles(node.status);
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    style={{ position: 'relative' }}
                                >
                                    {/* Timeline Marker */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-52px',
                                        top: '30px',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        background: '#FFF',
                                        border: `3px solid ${styles.border}`,
                                        boxShadow: node.status === 'CURRENT' ? '0 0 15px rgba(255,110,20,0.4)' : 'none',
                                        zIndex: 10
                                    }}>
                                        {node.status === 'CURRENT' && (
                                            <div style={{ position: 'absolute', top: '-40px', left: '-5px', fontSize: '1.5rem' }}>🚀</div>
                                        )}
                                    </div>

                                    {/* Timeline Card */}
                                    <div style={{
                                        background: '#FFF',
                                        padding: '2.5rem',
                                        borderRadius: '32px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                        border: '1px solid #F0F0F0',
                                        textAlign: 'left'
                                    }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            background: '#FFF0E6',
                                            color: '#FF6E14',
                                            fontWeight: '800',
                                            fontSize: '0.85rem',
                                            marginBottom: '1.5rem'
                                        }}>
                                            {node.label}
                                        </div>

                                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '5px' }}>{node.title}</h2>
                                        <h3 style={{ fontSize: '1.1rem', color: '#828282', fontWeight: '600', marginBottom: '1.5rem' }}>{node.subtitle}</h3>

                                        <div style={{
                                            background: styles.bg,
                                            color: styles.color,
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontWeight: '900',
                                            fontSize: '0.8rem',
                                            letterSpacing: '1px',
                                            marginBottom: '2rem'
                                        }}>
                                            <span style={{ fontSize: '1rem' }}>{node.status === 'CURRENT' ? '📍' : '🎯'}</span>
                                            {node.status}
                                        </div>

                                        <p style={{ color: '#4F4F4F', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                            {node.description}
                                        </p>

                                        <div>
                                            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: '#828282', letterSpacing: '1px', marginBottom: '15px' }}>Strategic Skills</h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {node.skills.map((skill, i) => (
                                                    <div key={i} style={{
                                                        background: '#F8F9FB',
                                                        color: '#1A1A1A',
                                                        padding: '10px 20px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.95rem',
                                                        fontWeight: '700',
                                                        border: '1px solid #EEE'
                                                    }}>
                                                        {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/career/recommendations')} className="btn-outline" style={{ padding: '15px 40px', borderRadius: '16px' }}>
                        Explore Other Roles
                    </button>
                    <button onClick={() => navigate('/profile/skill-levels')} className="auth-button" style={{ margin: 0, width: 'auto', padding: '0 40px', height: '56px', borderRadius: '16px' }}>
                        Refine My Skills
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerTimeline;
