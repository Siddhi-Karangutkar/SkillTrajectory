import React from 'react';

const PageStub = ({ title }) => {
    return (
        <div className="page-stub">
            <main style={{ padding: '120px 2rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f7f8fa' }}>
                <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                    <h1 style={{ color: '#1A1A1A', marginBottom: '1.5rem' }}>{title}</h1>
                    <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>
                        This module is part of the SkillTrajectory ecosystem and is currently under development.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        style={{ padding: '1rem 2rem', background: 'var(--grad-primary)', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}
                    >
                        Go Back
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PageStub;
