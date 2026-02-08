import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const SkillLevels = () => {
    const { user, updateProfile } = useAuth();
    const [skillList, setSkillList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    const GUIDE = [
        { id: 'Beginner', label: 'Beginner', range: '0-25%', color: '#FF5A79' },
        { id: 'Learning', label: 'Learning', range: '25-50%', color: '#FFC107' },
        { id: 'Intermediate', label: 'Intermediate', range: '50-75%', color: '#007BFF' },
        { id: 'Advanced', label: 'Advanced', range: '75-90%', color: '#28A745' },
        { id: 'Expert', label: 'Expert', range: '90-100%', color: '#6A5AE0' }
    ];

    useEffect(() => {
        if (user?.profile?.skills && !isInitialized) {
            const normalizedSkills = user.profile.skills.map(skill => ({
                ...skill,
                score: skill.score || 0,
                level: getLevelFromScore(skill.score || 0)
            }));
            setSkillList(normalizedSkills);
            setIsInitialized(true);
        }
    }, [user, isInitialized]);

    const getLevelFromScore = (score) => {
        if (score >= 90) return 'Expert';
        if (score >= 75) return 'Advanced';
        if (score >= 50) return 'Intermediate';
        if (score >= 25) return 'Learning';
        return 'Beginner';
    };

    const getColorForScore = (score) => {
        if (score >= 90) return '#6A5AE0';
        if (score >= 75) return '#28A745';
        if (score >= 50) return '#007BFF';
        if (score >= 25) return '#FFC107';
        return '#FF5A79';
    };

    const handleScoreChange = (skillName, newScore) => {
        setSkillList(prev => prev.map(s =>
            s.name === skillName ? {
                ...s,
                score: parseInt(newScore),
                level: getLevelFromScore(newScore)
            } : s
        ));
    };

    const calculateOverallProficiency = () => {
        if (skillList.length === 0) return 0;
        const total = skillList.reduce((acc, s) => acc + s.score, 0);
        return Math.round(total / skillList.length);
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            await updateProfile({
                ...user.profile,
                skills: skillList,
                isOnboardingComplete: true
            });
            setSuccess('Proficiency mastery saved and synced to database!');
            setTimeout(() => {
                setSuccess('');
                navigate('/');
            }, 2500);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const overallScore = calculateOverallProficiency();
    const overallLevel = getLevelFromScore(overallScore);

    if (skillList.length === 0 && !user) {
        return (
            <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid #FF6E14', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8F9FB', paddingBottom: '120px' }}>
            {/* Hero Section */}
            <div style={{
                background: '#FFF5F0',
                padding: '120px 20px 100px 20px',
                textAlign: 'center',
                color: '#1A1A1A',
                position: 'relative',
                borderBottom: '1px solid #FFE0D1'
            }}>
                <div style={{
                    display: 'inline-block',
                    padding: '8px 24px',
                    borderRadius: '50px',
                    border: '1px solid #FFE0D1',
                    background: '#FFF',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '2rem',
                    color: '#FF6E14'
                }}>
                    ASSESSMENT
                </div>
                <h1 style={{ fontSize: '4.5rem', fontWeight: '950', marginBottom: '1.5rem', letterSpacing: '-3px', color: '#1A1A1A' }}>Define Your Proficiency</h1>
                <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                    Calibrate your skills to receive hyper-personalized career and learning trajectories based on live market analysis.
                </p>
            </div>

            <div style={{ maxWidth: '1400px', width: '95%', margin: '-50px auto 0 auto', position: 'relative', zIndex: 10 }}>

                {/* Overall Proficiency Card */}
                <div style={{
                    borderRadius: '32px',
                    padding: '3.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    background: '#FFF',
                    border: '1px solid #F0F0F0',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '950', margin: '0 0 10px 0', color: '#1A1A1A', letterSpacing: '-1px' }}>Overall Proficiency</h2>
                        <p style={{ color: '#666', margin: 0, fontSize: '1.1rem' }}>Aggregate matching score based on current market standards.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
                        <span style={{ fontSize: '5.5rem', fontWeight: '950', color: getColorForScore(overallScore), letterSpacing: '-3px' }}>{overallScore}%</span>
                        <div style={{
                            background: `${getColorForScore(overallScore)}15`,
                            color: getColorForScore(overallScore),
                            padding: '16px 32px',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '950',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {overallLevel}
                        </div>
                    </div>
                </div>

                {/* Proficiency Guide & Cards Container */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2.5rem' }}>

                    {/* Sidebar: Proficiency Guide */}
                    <div style={{
                        background: '#FFF',
                        borderRadius: '32px',
                        padding: '2.5rem',
                        border: '1px solid #F0F0F0',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '120px'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 0 2rem 0', color: '#1A1A1A' }}>Mastery Scale</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {GUIDE.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{
                                        width: '60px',
                                        background: item.color,
                                        color: '#FFF',
                                        padding: '6px 0',
                                        textAlign: 'center',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800'
                                    }}>
                                        {item.range}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', color: '#1A1A1A', fontWeight: '700' }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Cards Grid - 3 per row */}
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                            {skillList.map((skill, idx) => {
                                const scoreColor = getColorForScore(skill.score);
                                return (
                                    <div key={idx} style={{ background: '#FFF', borderRadius: '24px', padding: '2rem', border: '1px solid #F0F0F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{skill.name}</h4>
                                            <div style={{
                                                background: `${scoreColor}10`,
                                                color: scoreColor,
                                                padding: '6px 14px',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: '900',
                                                textTransform: 'uppercase'
                                            }}>
                                                {skill.level}
                                            </div>
                                        </div>

                                        <div style={{ position: 'relative', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={skill.score}
                                                onChange={(e) => handleScoreChange(skill.name, e.target.value)}
                                                className="prof-slider"
                                                style={{
                                                    width: '100%',
                                                    background: `linear-gradient(to right, ${scoreColor} 0%, ${scoreColor} ${skill.score}%, #F3F4F6 ${skill.score}%, #F3F4F6 100%)`
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: '950', color: scoreColor }}>{skill.score}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #EEE', paddingTop: '3.5rem' }}>
                            <button onClick={handleSave} className="auth-button" disabled={loading} style={{
                                flex: 2, margin: 0, height: '72px', fontSize: '1.2rem', borderRadius: '20px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px'
                            }}>
                                {loading ? (
                                    <>
                                        <div className="loader" style={{ width: '20px', height: '20px', border: '2px solid #FFF', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        Saving Your Journey...
                                    </>
                                ) : 'Save proficiency & Complete →'}
                            </button>
                            <button onClick={() => navigate('/profile/edit-skills')} className="btn btn-outline" style={{ flex: 1, borderRadius: '20px', fontWeight: '800', border: '2px solid #EEE', height: '72px' }}>
                                Back
                            </button>
                        </div>

                        {error && <div className="error-message" style={{ marginTop: '2rem', textAlign: 'center' }}>{error}</div>}

                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="success-message"
                                    style={{
                                        background: 'rgba(52, 211, 153, 0.1)',
                                        color: '#059669',
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        marginTop: '2rem',
                                        border: '1px solid rgba(52, 211, 153, 0.2)',
                                        textAlign: 'center',
                                        fontWeight: '800',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {success}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default SkillLevels;
