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
    const navigate = useNavigate();

    const GUIDE = [
        { id: 'Beginner', label: 'Beginner', range: '0-25%', color: '#FF5A79' },
        { id: 'Learning', label: 'Learning', range: '25-50%', color: '#FFC107' },
        { id: 'Intermediate', label: 'Intermediate', range: '50-75%', color: '#007BFF' },
        { id: 'Advanced', label: 'Advanced', range: '75-90%', color: '#28A745' },
        { id: 'Expert', label: 'Expert', range: '90-100%', color: '#6A5AE0' }
    ];

    useEffect(() => {
        if (user?.profile?.skills) {
            const normalizedSkills = user.profile.skills.map(skill => ({
                ...skill,
                score: skill.score || 0,
                level: getLevelFromScore(skill.score || 0)
            }));
            setSkillList(normalizedSkills);
        }
    }, [user]);

    const getLevelFromScore = (score) => {
        if (score >= 90) return 'Expert';
        if (score >= 75) return 'Advanced';
        if (score >= 50) return 'Intermediate';
        if (score >= 25) return 'Learning';
        return 'Beginner';
    };

    const getColorForScore = (score) => {
        if (score >= 90) return '#6A5AE0'; // Expert (Purple)
        if (score >= 75) return '#28A745'; // Advanced (Green)
        if (score >= 50) return '#007BFF'; // Intermediate (Blue)
        if (score >= 25) return '#FFC107'; // Learning (Yellow)
        return '#FF5A79'; // Beginner (Pink)
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
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div className="auth-card" style={{ maxWidth: '1100px', width: '100%', background: '#FFF', padding: '3.5rem', borderRadius: '40px' }}>

                {/* Overall Proficiency Card */}
                <div style={{
                    border: `1px solid ${getColorForScore(overallScore)}`,
                    borderRadius: '24px',
                    padding: '2.5rem 3.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    background: '#FFF',
                    boxShadow: `0 4px 20px ${getColorForScore(overallScore)}15`
                }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 10px 0', color: '#1A1A1A' }}>Overall Proficiency</h2>
                        <p style={{ color: '#666', margin: 0, fontSize: '1rem' }}>Aggregate matching score based on current market standards.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <span style={{ fontSize: '4.5rem', fontWeight: '950', color: getColorForScore(overallScore), letterSpacing: '-2px' }}>{overallScore}%</span>
                        <div style={{
                            background: `${getColorForScore(overallScore)}15`,
                            color: getColorForScore(overallScore),
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {overallLevel}
                        </div>
                    </div>
                </div>

                {/* Proficiency Guide */}
                <div style={{ background: '#FFF', borderRadius: '32px', padding: '3rem', border: '1px solid #F0F0F0', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', marginBottom: '3.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 2.5rem 0', color: '#1A1A1A' }}>Proficiency Guide legend</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
                        {GUIDE.map(item => (
                            <div key={item.id} style={{ textAlign: 'center', flex: 1, minWidth: '100px' }}>
                                <div style={{
                                    background: item.color,
                                    color: '#FFF',
                                    padding: '8px 20px',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    fontWeight: '800',
                                    marginBottom: '15px',
                                    display: 'inline-block',
                                    boxShadow: `0 4px 15px ${item.color}40`
                                }}>
                                    {item.range}
                                </div>
                                <div style={{ fontSize: '1rem', color: '#1A1A1A', fontWeight: '700' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
                    {skillList.map((skill, idx) => {
                        const scoreColor = getColorForScore(skill.score);
                        return (
                            <div key={idx} style={{ background: '#FFF', borderRadius: '28px', padding: '2.5rem', border: '1px solid #F0F0F0', boxShadow: '0 4px 30px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: '#1A1A1A' }}>{skill.name}</h4>
                                    <div style={{
                                        background: `${scoreColor}15`,
                                        color: scoreColor,
                                        padding: '8px 18px',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: '900',
                                        textTransform: 'uppercase'
                                    }}>
                                        {skill.level}
                                    </div>
                                </div>

                                <div style={{ position: 'relative', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                                        <span style={{ fontSize: '1.4rem', fontWeight: '950', color: scoreColor }}>{skill.score}%</span>
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
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SkillLevels;
