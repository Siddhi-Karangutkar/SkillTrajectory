import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const CreateProfile = () => {
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { updateProfile } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const profileData = {
                bio,
                skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
                location,
                currentRole,
                targetRole,
                yearsOfExperience: Number(yearsOfExperience)
            };
            await updateProfile(profileData);
            navigate('/'); // Redirect to home after profile setup
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <h2>Complete Your Profile</h2>
                <p>Help us personalize your career trajectory</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Professional Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="3"
                            style={{
                                width: '100%',
                                background: '#F7F8FA',
                                border: '1px solid #E0E0E0',
                                color: '#1A1A1A',
                                padding: '1rem',
                                borderRadius: '12px'
                            }}
                            placeholder="Briefly describe your professional journey..."
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Current Role</label>
                            <input
                                type="text"
                                value={currentRole}
                                onChange={(e) => setCurrentRole(e.target.value)}
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div className="form-group">
                            <label>Target Role</label>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="AI Engineer"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Years of Exp</label>
                        <input
                            type="number"
                            value={yearsOfExperience}
                            onChange={(e) => setYearsOfExperience(e.target.value)}
                            placeholder="2"
                        />
                    </div>
                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input
                            type="text"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="React, Node.js, Python, AWS"
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="San Francisco, CA"
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Finish Setup'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProfile;
