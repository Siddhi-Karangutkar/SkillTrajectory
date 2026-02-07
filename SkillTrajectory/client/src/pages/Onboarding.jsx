import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const Onboarding = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State for each step
    const [formData, setFormData] = useState({
        fullName: user?.profile?.fullName || '',
        phone: user?.profile?.phone || '',
        bio: user?.profile?.bio || '',
        currentRole: user?.profile?.currentRole || '',
        location: user?.profile?.location || '',
        education: user?.profile?.education || [{ school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }],
        experience: user?.profile?.experience || [{ company: '', position: '', location: '', startDate: '', endDate: '', description: '' }],
        projects: user?.profile?.projects || [{ title: '', description: '', link: '' }],
        skills: user?.profile?.skills || [],
        interests: user?.profile?.interests || [],
        constraints: user?.profile?.constraints || { preferredLocation: '', availableTime: '', incomeNeeds: '' }
    });

    const [newSkill, setNewSkill] = useState('');
    const [suggestions, setSuggestions] = useState({ type: '', list: [] });
    const [showSuggestions, setShowSuggestions] = useState({ section: '', index: null, field: '' });

    const DEGREES = [
        'High School Diploma', 'Associate Degree', 'Bachelor of Science (BSc)', 'Bachelor of Arts (BA)',
        'Bachelor of Engineering (BEng)', 'Master of Science (MSc)', 'Master of Arts (MA)',
        'Master of Engineering (MEng)', 'MBA', 'PhD', 'Doctorate', 'Diploma', 'Certification',
        'Post Graduate Diploma', 'Executive MBA', 'M.Tech', 'B.Tech'
    ];
    const FIELDS_OF_STUDY = [
        'Computer Science', 'Data Science', 'Information Technology', 'Software Engineering',
        'Artificial Intelligence', 'Cybersecurity', 'Mathematics', 'Physics', 'Chemistry',
        'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering',
        'Business Administration', 'Marketing', 'Finance', 'Economics', 'Management',
        'Psychology', 'Sociology', 'Graphic Design', 'Digital Arts', 'Architecture', 'Law',
        'Medicine', 'Pharmacy', 'Biotechnology', 'Journalism', 'Public Relations'
    ];
    const POSITIONS = [
        'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
        'Mobile Developer (iOS/Android)', 'Data Scientist', 'Data Analyst', 'Data Engineer',
        'Machine Learning Engineer', 'DevOps Engineer', 'Cloud Architect', 'Cybersecurity Specialist',
        'Product Manager', 'Project Manager', 'Program Manager', 'Technical Product Manager',
        'UX Designer', 'UI Designer', 'Product Designer', 'Graphic Designer',
        'Marketing Manager', 'Digital Marketer', 'Content Strategist', 'SEO Specialist',
        'Sales Representative', 'Account Manager', 'Business Development Manager',
        'Customer Success Manager', 'HR Manager', 'Talent Acquisition Specialist',
        'Operations Manager', 'Financial Analyst', 'Investment Banker', 'Legal Counsel'
    ];

    const ROLE_SKILLS = {
        'Software Engineer': {
            macro: ['Java', 'Python', 'C++', 'System Architecture', 'Git', 'Docker', 'Agile'],
            micro: ['Problem Solving', 'Analytical Thinking', 'Team Collaboration', 'Continuous Learning']
        },
        'Full Stack Developer': {
            macro: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'REST APIs', 'System Design'],
            micro: ['Time Management', 'Communication', 'Attention to Detail', 'Adaptability']
        },
        'Frontend Developer': {
            macro: ['JavaScript', 'HTML5/CSS3', 'React', 'Vue.js', 'Next.js', 'Tailwind CSS', 'Redux'],
            micro: ['User Empathy', 'Creative Thinking', 'Collaboration', 'Visual Communication']
        },
        'Backend Developer': {
            macro: ['Go', 'Rust', 'Ruby on Rails', 'SQL', 'Redis', 'Microservices', 'OAuth'],
            micro: ['Security Awareness', 'Critical Thinking', 'Patience', 'Documentation']
        },
        'Data Scientist': {
            macro: ['Python', 'R', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'Statistics'],
            micro: ['Data Storytelling', 'Curiosity', 'Business Intuition', 'Ethics']
        },
        'Data Analyst': {
            macro: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Python', 'Statistics', 'Data Cleaning'],
            micro: ['Attention to Detail', 'Communication', 'Logical Reasoning', 'Objectivity']
        },
        'DevOps Engineer': {
            macro: ['Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'AWS/Azure', 'CI/CD', 'Linux'],
            micro: ['Reliability', 'Calmness under Pressure', 'Systemic Thinking', 'Collaboration']
        },
        'Cloud Architect': {
            macro: ['Cloud Strategy', 'AWS', 'Azure', 'GCP', 'Network Security', 'Cost Optimization'],
            micro: ['Decision Making', 'Strategic Planning', 'Visionary Thinking', 'Leadership']
        },
        'Cybersecurity Specialist': {
            macro: ['Pentesting', 'Network Security', 'Encryption', 'Incident Response', 'Firewalls'],
            micro: ['Integrity', 'Vigilance', 'Discretion', 'Problem Solving']
        },
        'Product Manager': {
            macro: ['Roadmap Planning', 'User Research', 'A/B Testing', 'Market Analysis', 'Figma'],
            micro: ['Leadership', 'Negotiation', 'Strategic Thinking', 'Public Speaking']
        },
        'UX Designer': {
            macro: ['Figma', 'Adobe XD', 'Prototyping', 'User Interviews', 'Wireframing', 'Accessibility'],
            micro: ['Empathetic Design', 'User Advocacy', 'Storytelling', 'Feedback Receptivity']
        },
        'UI Designer': {
            macro: ['Visual Design', 'Design Systems', 'Typography', 'Iconography', 'Adobe Illustrator'],
            micro: ['Aesthetics', 'Trend Awareness', 'Communication', 'Precision']
        },
        'Marketing Manager': {
            macro: ['SEO', 'Content Strategy', 'Google Analytics', 'Social Media Ads', 'Brand Identity'],
            micro: ['Creativity', 'Persuasion', 'Networking', 'Emotional Intelligence']
        },
        'Financial Analyst': {
            macro: ['Financial Modeling', 'Valuation', 'Budgeting', 'Risk Assessment', 'Excel/VBA'],
            micro: ['Precision', 'Confidentiality', 'Global Outlook', 'Stress Tolerance']
        },
        'HR Manager': {
            macro: ['Recruitment', 'Employee Relations', 'HRIS', 'Labor Law', 'Performance Management'],
            micro: ['Conflict Resolution', 'Confidentiality', 'Active Listening', 'Organization']
        }
    };

    const fetchLocations = async (query) => {
        if (!query || query.length < 3) return;
        try {
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            const locs = data.features.map(f => {
                const name = f.properties.name;
                const city = f.properties.city || '';
                const country = f.properties.country || '';
                return `${name}${city ? ', ' + city : ''}${country ? ', ' + country : ''}`;
            });
            setSuggestions({ type: 'location', list: locs });
        } catch (err) {
            console.error('Location fetch error:', err);
        }
    };

    const fetchUniversities = async (query) => {
        if (!query || query.length < 3) return;
        try {
            const response = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
            const data = await response.json();
            const unis = data.map(u => u.name).slice(0, 5);
            setSuggestions({ type: 'university', list: unis });
        } catch (err) {
            console.error('University fetch error:', err);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleInputChange = (e, section = null, index = null) => {
        const { name, value } = e.target;
        if (section && index !== null) {
            const updatedSection = [...formData[section]];
            updatedSection[index][name] = value;
            setFormData({ ...formData, [section]: updatedSection });

            // Handle suggestions for nested fields
            if (name === 'degree') {
                const filtered = DEGREES.filter(d => d.toLowerCase().includes(value.toLowerCase()));
                setSuggestions({ type: 'degree', list: filtered });
                setShowSuggestions({ section, index, field: name });
            } else if (name === 'fieldOfStudy') {
                const filtered = FIELDS_OF_STUDY.filter(f => f.toLowerCase().includes(value.toLowerCase()));
                setSuggestions({ type: 'fieldOfStudy', list: filtered });
                setShowSuggestions({ section, index, field: name });
            } else if (name === 'position') {
                const filtered = POSITIONS.filter(p => p.toLowerCase().includes(value.toLowerCase()));
                setSuggestions({ type: 'position', list: filtered });
                setShowSuggestions({ section, index, field: name });
            } else if (name === 'school') {
                fetchUniversities(value);
                setShowSuggestions({ section, index, field: name });
            }
        } else if (section) {
            setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
            if (name === 'preferredLocation') {
                fetchLocations(value);
                setShowSuggestions({ section, index: null, field: name });
            }
        } else {
            setFormData({ ...formData, [name]: value });
            if (name === 'currentRole') {
                const filtered = POSITIONS.filter(p => p.toLowerCase().includes(value.toLowerCase()));
                setSuggestions({ type: 'position', list: filtered });
                setShowSuggestions({ section: null, index: null, field: name });
            }
        }
    };

    const selectSuggestion = (value, section, index, field) => {
        if (section && index !== null) {
            const updatedSection = [...formData[section]];
            updatedSection[index][field] = value;
            setFormData({ ...formData, [section]: updatedSection });
        } else if (section) {
            setFormData({ ...formData, [section]: { ...formData[section], [field]: value } });
        } else {
            setFormData({ ...formData, [field]: value });
        }
        setShowSuggestions({ section: '', index: null, field: '' });
    };

    const addListItem = (section, initialObj) => {
        setFormData({ ...formData, [section]: [...formData[section], initialObj] });
    };

    const removeListItem = (section, index) => {
        const updatedSection = formData[section].filter((_, i) => i !== index);
        setFormData({ ...formData, [section]: updatedSection });
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !formData.skills.some(s => s.name === newSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, { name: newSkill.trim(), category: 'technical' }] });
            setNewSkill('');
        }
    };

    const removeSkill = (skillName) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s.name !== skillName) });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await updateProfile({ ...formData, isOnboardingComplete: true });
            navigate('/');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => (
        <div className="progress-container" style={{ marginBottom: '2.5rem' }}>
            <div className="progress-bar-bg" style={{ height: '6px', background: '#F0F0F0', borderRadius: '10px', position: 'relative' }}>
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 5) * 100}%` }}
                    style={{ height: '100%', background: '#FF6E14', borderRadius: '10px' }}
                />
            </div>
            <div className="progress-labels" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: '#828282' }}>
                <span>Identity</span>
                <span>Education</span>
                <span>Experience</span>
                <span>Skills</span>
                <span>Interests</span>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Step 1: Your Professional Identity</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>Let's start with the basics. Who are you in the professional world?</p>
            <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" />
            </div>
            <div className="form-group">
                <label>Professional Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E0E0E0', background: '#F7F8FA' }}
                />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
                <label>Current Role</label>
                <div className="dropdown-wrapper">
                    <input
                        type="text"
                        name="currentRole"
                        value={formData.currentRole}
                        onChange={handleInputChange}
                        onFocus={() => {
                            setSuggestions({ type: 'position', list: POSITIONS });
                            setShowSuggestions({ section: null, index: null, field: 'currentRole' });
                        }}
                        placeholder="e.g. Senior Product Designer"
                        autoComplete="off"
                        style={{ paddingRight: '40px' }}
                    />
                </div>
                {!showSuggestions.section && showSuggestions.field === 'currentRole' && suggestions.list.length > 0 && (
                    <div className="suggestions-list">
                        {suggestions.list.map((item, i) => (
                            <div key={i} className="suggestion-item" onClick={() => selectSuggestion(item, null, null, 'currentRole')}>{item}</div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Step 2: Educational Journey</h3>
            {formData.education.map((edu, index) => (
                <div key={index} className="onboarding-card" style={{ padding: '1.5rem', border: '1px solid #EEE', borderRadius: '16px', marginBottom: '1.5rem', background: '#FFF' }}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>School/University</label>
                        <div className="dropdown-wrapper">
                            <input
                                type="text"
                                name="school"
                                value={edu.school}
                                onChange={(e) => handleInputChange(e, 'education', index)}
                                onFocus={() => {
                                    setShowSuggestions({ section: 'education', index, field: 'school' });
                                }}
                                placeholder="University of Oxford"
                                autoComplete="off"
                                style={{ paddingRight: '40px' }}
                            />
                        </div>
                        {showSuggestions.section === 'education' && showSuggestions.index === index && showSuggestions.field === 'school' && suggestions.list.length > 0 && (
                            <div className="suggestions-list">
                                {suggestions.list.map((item, i) => (
                                    <div key={i} className="suggestion-item" onClick={() => selectSuggestion(item, 'education', index, 'school')}>{item}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label>Degree</label>
                            <div className="dropdown-wrapper">
                                <input
                                    type="text"
                                    name="degree"
                                    value={edu.degree}
                                    onChange={(e) => handleInputChange(e, 'education', index)}
                                    onFocus={() => {
                                        setSuggestions({ type: 'degree', list: DEGREES });
                                        setShowSuggestions({ section: 'education', index, field: 'degree' });
                                    }}
                                    placeholder="BSc"
                                    autoComplete="off"
                                    style={{ paddingRight: '40px' }}
                                />
                            </div>
                            {showSuggestions.section === 'education' && showSuggestions.index === index && showSuggestions.field === 'degree' && suggestions.list.length > 0 && (
                                <div className="suggestions-list">
                                    {suggestions.list.map((item, i) => (
                                        <div key={i} className="suggestion-item" onClick={() => selectSuggestion(item, 'education', index, 'degree')}>{item}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label>Field of Study</label>
                            <div className="dropdown-wrapper">
                                <input
                                    type="text"
                                    name="fieldOfStudy"
                                    value={edu.fieldOfStudy}
                                    onChange={(e) => handleInputChange(e, 'education', index)}
                                    onFocus={() => {
                                        setSuggestions({ type: 'fieldOfStudy', list: FIELDS_OF_STUDY });
                                        setShowSuggestions({ section: 'education', index, field: 'fieldOfStudy' });
                                    }}
                                    placeholder="Computer Science"
                                    autoComplete="off"
                                    style={{ paddingRight: '40px' }}
                                />
                            </div>
                            {showSuggestions.section === 'education' && showSuggestions.index === index && showSuggestions.field === 'fieldOfStudy' && suggestions.list.length > 0 && (
                                <div className="suggestions-list">
                                    {suggestions.list.map((item, i) => (
                                        <div key={i} className="suggestion-item" onClick={() => selectSuggestion(item, 'education', index, 'fieldOfStudy')}>{item}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={() => removeListItem('education', index)} style={{ color: '#ff4444', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove School</button>
                </div>
            ))}
            <button className="btn btn-outline" onClick={() => addListItem('education', { school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' })}>+ Add Education</button>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ marginBottom: '1rem' }}>Step 3: Work & Impact</h3>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem' }}>ℹ️ This is not a resume. Focus on roles where you utilized key skills.</p>
            {formData.experience.map((exp, index) => (
                <div key={index} className="onboarding-card" style={{ padding: '1.5rem', border: '1px solid #EEE', borderRadius: '16px', marginBottom: '1.5rem', background: '#FFF' }}>
                    <div className="form-group">
                        <label>Company</label>
                        <input type="text" name="company" value={exp.company} onChange={(e) => handleInputChange(e, 'experience', index)} placeholder="Tech Corp" />
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Position</label>
                        <div className="dropdown-wrapper">
                            <input
                                type="text"
                                name="position"
                                value={exp.position}
                                onChange={(e) => handleInputChange(e, 'experience', index)}
                                onFocus={() => {
                                    setSuggestions({ type: 'position', list: POSITIONS });
                                    setShowSuggestions({ section: 'experience', index, field: 'position' });
                                }}
                                placeholder="Software Engineer"
                                autoComplete="off"
                                style={{ paddingRight: '40px' }}
                            />
                        </div>
                        {showSuggestions.section === 'experience' && showSuggestions.index === index && showSuggestions.field === 'position' && suggestions.list.length > 0 && (
                            <div className="suggestions-list">
                                {suggestions.list.map((item, i) => (
                                    <div key={i} className="suggestion-item" onClick={() => selectSuggestion(item, 'experience', index, 'position')}>{item}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => removeListItem('experience', index)} style={{ color: '#ff4444', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove Experience</button>
                </div>
            ))}
            <button className="btn btn-outline" onClick={() => addListItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', description: '' })}>+ Add Work Experience</button>
        </motion.div>
    );

    const SUGGESTED_SKILLS = [
        'Data Visualization', 'Rapid Prototyping', 'API Integration',
        'Cloud Architecture', 'UI Component Design', 'State Management',
        'Unit Testing', 'Agile Methodology', 'UX Research', 'Database Design'
    ];

    const toggleSuggestedSkill = (skillName, category = 'technical') => {
        if (formData.skills.some(s => s.name === skillName)) {
            removeSkill(skillName);
        } else {
            setFormData({ ...formData, skills: [...formData.skills, { name: skillName, category }] });
        }
    };

    const getSuggestedSkills = () => {
        const role = formData.currentRole || (formData.experience[0]?.position) || 'Software Engineer';
        const match = Object.keys(ROLE_SKILLS).find(r =>
            role.toLowerCase().includes(r.toLowerCase()) ||
            r.toLowerCase().includes(role.toLowerCase())
        ) || 'Software Engineer';
        return ROLE_SKILLS[match];
    };

    const renderStep4 = () => {
        const suggested = getSuggestedSkills();

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Step 4: Skill Mastery</h3>
                    <span className="tooltip-icon" title="Macro skills represent your technical and domain expertise, while Micro skills focus on soft skills and interpersonal capabilities." style={{ cursor: 'help', color: '#FF6E14', fontSize: '1.2rem' }}>ⓘ</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>Let's categorize your expertise for better trajectory modeling.</p>

                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a custom skill (e.g. System Design)"
                    />
                    <button type="submit" className="auth-button" style={{ marginTop: 0, width: '120px' }}>Add</button>
                </form>

                <div className="skills-section" style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1A1A1A', display: 'block', marginBottom: '1rem' }}>Macro Skills (Technical & Domain)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {suggested.macro.map((skill, index) => (
                            <button
                                key={`macro-${index}`}
                                onClick={() => toggleSuggestedSkill(skill, 'technical')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    border: '1px solid',
                                    borderColor: formData.skills.some(s => s.name === skill) ? '#FF6E14' : '#E0E0E0',
                                    background: formData.skills.some(s => s.name === skill) ? 'rgba(255, 110, 20, 0.1)' : '#FFF',
                                    color: formData.skills.some(s => s.name === skill) ? '#FF6E14' : '#666',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                {formData.skills.some(s => s.name === skill) ? '✓ ' : '+ '}{skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="skills-section" style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1A1A1A', display: 'block', marginBottom: '1rem' }}>Micro Skills (Soft & Interpersonal)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {suggested.micro.map((skill, index) => (
                            <button
                                key={`micro-${index}`}
                                onClick={() => toggleSuggestedSkill(skill, 'soft')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    border: '1px solid',
                                    borderColor: formData.skills.some(s => s.name === skill) ? '#FF6E14' : '#E0E0E0',
                                    background: formData.skills.some(s => s.name === skill) ? 'rgba(255, 110, 20, 0.1)' : '#FFF',
                                    color: formData.skills.some(s => s.name === skill) ? '#FF6E14' : '#666',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                {formData.skills.some(s => s.name === skill) ? '✓ ' : '+ '}{skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem', minHeight: '80px', padding: '1.5rem', border: '2px dashed #F0F0F0', borderRadius: '16px' }}>
                    {formData.skills.length > 0 ? formData.skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="skill-chip"
                            style={{
                                background: skill.category === 'soft' ? '#FF5A79' : '#FF6E14',
                                color: '#FFF',
                                padding: '8px 16px',
                                borderRadius: '25px',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {skill.name}
                            <span onClick={() => removeSkill(skill.name)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</span>
                        </motion.div>
                    )) : (
                        <div style={{ color: '#CCC', width: '100%', textAlign: 'center', alignSelf: 'center' }}>Selected skills will appear here</div>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderStep5 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Step 5: Interests & Constraints</h3>
            <div className="form-group" style={{ position: 'relative' }}>
                <label>Preferred Location</label>
                <div className="dropdown-wrapper">
                    <input
                        type="text"
                        name="preferredLocation"
                        value={formData.constraints.preferredLocation}
                        onChange={(e) => handleInputChange(e, 'constraints')}
                        placeholder="Remote, New York, etc."
                        autoComplete="off"
                        style={{ paddingRight: '40px' }}
                    />
                </div>
                {showSuggestions.section === 'constraints' && showSuggestions.field === 'preferredLocation' && suggestions.list.length > 0 && (
                    <div className="suggestions-list">
                        {suggestions.list.map((item, i) => (
                            <div key={i} className="suggestion-item" onClick={() => selectSuggestion(item, 'constraints', null, 'preferredLocation')}>{item}</div>
                        ))}
                    </div>
                )}
            </div>
            <div className="form-group">
                <label>Availability</label>
                <select name="availableTime" value={formData.constraints.availableTime} onChange={(e) => handleInputChange(e, 'constraints')} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#F7F8FA', border: '1px solid #E0E0E0' }}>
                    <option value="">Select availability</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time (20hrs/week)</option>
                    <option value="Freelance">Freelance/Contract</option>
                </select>
            </div>
            <div className="form-group">
                <label>Monthly Income Benchmark (Optional)</label>
                <input type="text" name="incomeNeeds" value={formData.constraints.incomeNeeds} onChange={(e) => handleInputChange(e, 'constraints')} placeholder="e.g. $5000" />
            </div>
        </motion.div>
    );

    return (
        <div
            className="auth-container"
            style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px' }}
            onClick={() => setShowSuggestions({ section: '', index: null, field: '' })}
        >
            <div className="auth-card" style={{ maxWidth: '800px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                {renderProgressBar()}

                <AnimatePresence mode="wait">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}
                </AnimatePresence>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                    {step > 1 && (
                        <button className="btn btn-outline" onClick={prevStep}>Previous</button>
                    )}
                    <div style={{ marginLeft: 'auto' }}>
                        {step < 5 ? (
                            <button className="btn btn-primary" onClick={nextStep}>Next Step</button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Finalizing...' : 'Complete Trajectory Setup'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
