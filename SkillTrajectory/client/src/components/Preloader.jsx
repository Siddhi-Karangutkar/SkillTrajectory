import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                overflow: 'hidden'
            }}
        >
            {/* Soft Professional Background Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                {/* Professional Career Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                        borderRadius: '24px',
                        margin: '0 auto 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.15)',
                        color: '#FFF'
                    }}
                >
                    💼
                </motion.div>

                {/* Branding Text */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{
                        color: '#1E293B',
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        letterSpacing: '-0.5px',
                        margin: 0
                    }}
                >
                    SkillTrajectory
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    style={{
                        color: '#64748B',
                        marginTop: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                >
                    Mapping Your Career Path...
                </motion.p>

                {/* Subtle Loader Bar */}
                <div style={{
                    width: '180px',
                    height: '3px',
                    background: '#F1F5F9',
                    borderRadius: '10px',
                    marginTop: '2.5rem',
                    marginInline: 'auto',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, #6366F1, transparent)'
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;
