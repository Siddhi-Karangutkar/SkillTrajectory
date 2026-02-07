import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const EditSkills = () => {
    const { user, updateProfile } = useAuth();
    const [skillsString, setSkillsString] = useState('');
    const [skillList, setSkillList] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.profile?.skills) {
            setSkillList(user.profile.skills);
        }
    }, [user]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skillList.includes(newSkill.trim())) {
            setSkillList([...skillList, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkillList(skillList.filter(skill => skill !== skillToRemove));
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

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '100px 20px' }}>
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <h2>Manage Skills</h2>
                <p>Add or remove skills to refine your trajectory</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(40, 167, 69, 0.2)' }}>{success}</div>}

                <div className="form-group">
                    <label>Add New Skill</label>
                    <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="e.g. Python, AWS, Docker"
                        />
                        <button type="submit" className="auth-button" style={{ marginTop: 0, width: '120px' }}>Add</button>
                    </form>
                </div>

                <div className="skills-display" style={{ marginTop: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>Your Current Skills</label>
                    <div style={{ display: 'flex', wrap: 'wrap', gap: '10px', flexWrap: 'wrap' }}>
                        {skillList.length > 0 ? skillList.map((skill, index) => (
                            <div key={index} style={{
                                background: '#F7F8FA',
                                border: '1px solid #E0E0E0',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.9rem'
                            }}>
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    style={{ border: 'none', background: 'none', color: '#ff4444', fontWeight: 'bold', cursor: 'pointer', padding: '0 4px' }}
                                >
                                    ×
                                </button>
                            </div>
                        )) : (
                            <p style={{ fontStyle: 'italic', color: '#828282' }}>No skills added yet.</p>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleSave}
                        className="auth-button"
                        disabled={loading}
                        style={{ flex: 2 }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-outline"
                        style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSkills;
