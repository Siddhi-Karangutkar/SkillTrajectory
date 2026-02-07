import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const RecommendedCourses = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Add useLocation
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        targetSkill: location.state?.targetSkill || 'All Skills', // Initialize with state
        provider: 'All Platforms',
        duration: 'Any Duration'
    });

    const [showVelocity, setShowVelocity] = useState(false);
    const [weeklyHours, setWeeklyHours] = useState('');
    const [velocityResult, setVelocityResult] = useState(null);

    useEffect(() => {
        if (user) {
            fetchCourses();
        }
    }, [user, filters]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = user?.token;

            // Map 'All X' to null/undefined for backend
            const apiFilters = {
                targetSkill: filters.targetSkill === 'All Skills' ? null : filters.targetSkill,
                provider: filters.provider === 'All Platforms' ? null : filters.provider,
                duration: filters.duration === 'Any Duration' ? null : filters.duration
            };

            const response = await fetch('http://localhost:5000/api/users/recommended-courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ filters: apiFilters })
            });
            const data = await response.json();
            setCourses(data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const calculateVelocity = (hours) => {
        setWeeklyHours(hours);
        if (!hours || hours <= 0) {
            setVelocityResult(null);
            return;
        }

        // Calculate total hours of displayed courses
        const totalCourseHours = courses.reduce((acc, course) => {
            const match = course.duration?.match(/(\d+(\.\d+)?)/);
            return acc + (match ? parseFloat(match[0]) : 0);
        }, 0);

        const weeks = Math.ceil(totalCourseHours / hours);
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + (weeks * 7));

        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        setVelocityResult(`${weeks} weeks (${completionDate.toLocaleDateString('en-US', options)})`);
    };

    if (!user) return null;

    return (
        <div className="auth-container" style={{ minHeight: '100vh', height: 'auto', padding: '120px 20px', background: '#F8F9FB' }}>
            <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem' }}>

                    {/* Sidebar: Precision Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: '#FFF',
                            padding: '2.5rem',
                            borderRadius: '32px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                            border: '1px solid #F0F0F0',
                            height: 'fit-content',
                            textAlign: 'left'
                        }}
                    >
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '2rem' }}>Precision Filters</h2>

                        {/* Target Skill Filter */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '10px' }}>Target Skill</label>
                            <select
                                value={filters.targetSkill}
                                onChange={(e) => handleFilterChange('targetSkill', e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.9rem', fontWeight: '600', color: '#1A1A1A', outline: 'none' }}
                            >
                                <option>All Skills</option>
                                {user.profile.skills?.map((skill, idx) => (
                                    <option key={idx} value={skill.name}>{skill.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Learning Provider Filter */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '10px' }}>Learning Provider</label>
                            <select
                                value={filters.provider}
                                onChange={(e) => handleFilterChange('provider', e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.9rem', fontWeight: '600', color: '#1A1A1A', outline: 'none' }}
                            >
                                <option>All Platforms</option>
                                <option>Udemy</option>
                                <option>Coursera</option>
                                <option>Pluralsight</option>
                                <option>LinkedIn Learning</option>
                                <option>EdX</option>
                            </select>
                        </div>

                        {/* Time Commitment Filter */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#828282', textTransform: 'uppercase', marginBottom: '10px' }}>Time Commitment</label>
                            <select
                                value={filters.duration}
                                onChange={(e) => handleFilterChange('duration', e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.9rem', fontWeight: '600', color: '#1A1A1A', outline: 'none' }}
                            >
                                <option>Any Duration</option>
                                <option>Short (0-5 hours)</option>
                                <option>Medium (5-20 hours)</option>
                                <option>Long (20+ hours)</option>
                            </select>
                        </div>

                        <div style={{ background: '#F8F9FB', padding: '1.5rem', borderRadius: '20px', marginTop: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Want to know when you'll finish?</p>
                            <button
                                onClick={() => navigate('/learning/duration', { state: { courses } })}
                                style={{ width: '100%', padding: '12px', background: '#FFF', border: '1px solid #FF6E14', color: '#FF6E14', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                            >
                                Study Velocity Engine →
                            </button>
                        </div>

                    </motion.div>

                    {/* Course Grid */}
                    <div>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="loading-spinner" style={{ borderTopColor: '#FF6E14' }}></div>
                                    <h3 style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: '800', color: '#1A1A1A' }}>Finding best courses...</h3>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                                {courses.map((course, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{
                                            background: '#FFF',
                                            padding: '2.5rem',
                                            borderRadius: '24px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                            border: '1px solid #F0F0F0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                                <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '800' }}>
                                                    {course.provider}
                                                </span>
                                                <span style={{ background: '#F3F4F6', color: '#4B5563', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                                                    {course.level}
                                                </span>
                                            </div>

                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1A1A1A', marginBottom: '10px', lineHeight: '1.4' }}>
                                                {course.title}
                                            </h3>
                                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                                Master the fundamentals of {course.title} and relevant concepts.
                                            </p>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', color: '#4B5563', fontSize: '0.9rem', fontWeight: '600' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    ⭐ {course.rating}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    👥 {course.students?.toLocaleString()}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    ⏱️ {course.duration}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0F0F0', paddingTop: '1.5rem' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1A1A1A' }}>
                                                {course.price}
                                            </div>
                                            <button
                                                onClick={() => window.open(course.url, '_blank')}
                                                style={{
                                                    background: '#FF6E14',
                                                    color: '#FFF',
                                                    border: 'none',
                                                    padding: '12px 24px',
                                                    borderRadius: '12px',
                                                    fontWeight: '800',
                                                    fontSize: '0.95rem',
                                                    cursor: 'pointer',
                                                    transition: '0.2s',
                                                    boxShadow: '0 4px 12px rgba(255, 110, 20, 0.25)'
                                                }}
                                            >
                                                Enroll Path →
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendedCourses;
