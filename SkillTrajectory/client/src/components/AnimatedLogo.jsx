import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo = () => {
    return (
        <motion.div
            className="logo-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
            <div className="logo-icon" style={{
                width: '35px',
                height: '35px',
                background: 'var(--grad-primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
            }}>
                S
            </div>
            <span className="logo-text" style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: 'var(--secondary-color)',
                letterSpacing: '-1px'
            }}>
                SkillTrajectory
            </span>
        </motion.div>
    );
};

export default AnimatedLogo;
