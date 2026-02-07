import React from 'react';

const SkillOrbit = () => {
    return (
        <div className="model-placeholder" style={{
            height: '500px',
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,110,20,0.3)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#FF6E14'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚛️</div>
            <h3>3D Skill Orbit Model</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>[Three.js Visualization Placeholder]</p>
        </div>
    );
};

export default SkillOrbit;
