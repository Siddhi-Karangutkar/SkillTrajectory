import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const EditSkills = () => {
    const { user, updateProfile } = useAuth();
    const [skillList, setSkillList] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [activeCategory, setActiveCategory] = useState('technical');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    const CATEGORIES = [
        { id: 'technical', label: 'Technical', icon: '💻', color: '#6A5AE0' },
        { id: 'soft', label: 'Soft', icon: '🤝', color: '#FF5A79' },
        { id: 'tools', label: 'Tools', icon: '🛠️', color: '#38D7FF' },
        { id: 'languages', label: 'Languages', icon: '🌍', color: '#34D399' }
    ];

    const TRENDING_SUGGESTIONS = {
        technical: ['React', 'Python', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'Java', 'SQL'],
        soft: ['Communication', 'Leadership', 'Problem Solving', 'Adaptability', 'Teamwork', 'Critical Thinking'],
        tools: ['VS Code', 'Git', 'Jira', 'Figma', 'Postman', 'Docker', 'Jenkins'],
        languages: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Japanese']
    };

    useEffect(() => {
        if (user?.profile?.skills && !isInitialized) {
            setSkillList(user.profile.skills);
            setIsInitialized(true);
        }
    }, [user, isInitialized]);

    const handleAddSkill = (skillName, category = activeCategory) => {
        const name = skillName.trim();
        if (name && !skillList.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            setSkillList([...skillList, { name, category }]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillName) => {
        setSkillList(skillList.filter(s => s.name !== skillName));
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await updateProfile({
                ...user.profile,
                skills: skillList
            });
            setSuccess('Skills updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const getCountForCategory = (cat) => skillList.filter(s => s.category === cat).length;

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div className="auth-card" style={{ maxWidth: '1000px', width: '100%', background: '#FFF' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 10px 0' }}>Enhance Your Portfolio</h2>
                    <p style={{ color: '#666' }}>Select a category and add relevant skills to improve your marketability.</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#059669', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(52, 211, 153, 0.2)' }}>{success}</div>}

                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: activeCategory === cat.id ? '#FF6E14' : '#E0E0E0',
                                background: activeCategory === cat.id ? '#FF6E14' : '#FFF',
                                color: activeCategory === cat.id ? '#FFF' : '#666',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: activeCategory === cat.id ? '0 10px 20px rgba(255, 110, 20, 0.2)' : 'none'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Quick Add Bar */}
                <div style={{ position: 'relative', background: '#F7F8FA', borderRadius: '16px', padding: '8px', display: 'flex', gap: '10px', border: '1px solid #EEE', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '15px' }}>
                        <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>🔍</span>
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(newSkill)}
                            placeholder={`Add ${activeCategory} skill...`}
                            style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1rem', width: '100%', outline: 'none' }}
                        />
                    </div>
                    <button
                        onClick={() => handleAddSkill(newSkill)}
                        style={{ background: '#1A1A1A', color: '#FFF', padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Quick Add
                    </button>
                </div>

                {/* Trending Suggestions */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Trending Suggestions</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {TRENDING_SUGGESTIONS[activeCategory].map(skill => (
                            <button
                                key={skill}
                                onClick={() => handleAddSkill(skill)}
                                disabled={skillList.some(s => s.name.toLowerCase() === skill.toLowerCase())}
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: '50px',
                                    border: '1px solid #E0E0E0',
                                    background: '#FFF',
                                    color: '#333',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    opacity: skillList.some(s => s.name.toLowerCase() === skill.toLowerCase()) ? 0.5 : 1
                                }}
                            >
                                {skill} +
                            </button>
                        ))}
                    </div>
                </div>

                {/* Categorized Display Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {CATEGORIES.map(cat => (
                        <div key={cat.id} className="skill-cat-card" style={{ background: '#FFF', borderRadius: '24px', padding: '1.5rem', border: '1px solid #F0F0F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <div style={{ background: '#F7F8FA', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                    {cat.icon}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{cat.label}</h4>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', background: 'rgba(255, 110, 20, 0.1)', color: '#FF6E14', padding: '2px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>
                                        {getCountForCategory(cat.id)} SKILLS
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {skillList.filter(s => s.category === cat.id).map((skill, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{
                                            background: cat.color,
                                            color: '#FFF',
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: `0 4px 10px ${cat.color}33`
                                        }}
                                    >
                                        {skill.name}
                                        <span onClick={() => removeSkill(skill.name)} style={{ cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #EEE', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={handleSave} className="auth-button" disabled={loading} style={{ flex: 2, margin: 0, height: '56px' }}>
                            {loading ? 'Saving Changes...' : 'Save & Update Portfolio'}
                        </button>
                        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ flex: 1, borderRadius: '12px', fontSize: '1rem', fontWeight: '700' }}>
                            Back
                        </button>
                    </div>

                    {skillList.length > 0 && (
                        <button
                            onClick={() => navigate('/profile/skill-levels')}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#6A5AE0', border: 'none', color: '#FFF', fontWeight: 'bold' }}
                        >
                            Next: Set Proficiency Levels →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditSkills;
