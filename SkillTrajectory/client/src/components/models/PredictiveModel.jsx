import React from 'react';

const PredictiveModel = () => {
    return (
        <div className="model-placeholder" style={{
            height: '500px',
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(0,86,210,0.3)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#0056D2'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
            <h3>Predictive Career Engine</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>[Neural Graph Visualization Placeholder]</p>
        </div>
    );
};

export default PredictiveModel;
