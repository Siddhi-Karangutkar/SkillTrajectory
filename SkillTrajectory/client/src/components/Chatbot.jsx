import React, { useState } from 'react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="chatbot-container" style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    color: 'white',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 15px rgba(255, 110, 20, 0.4)'
                }}
            >
                {isOpen ? '×' : '💬'}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '75px',
                    right: 0,
                    width: '300px',
                    height: '400px',
                    background: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Career GPS Assistant</h3>
                    <div style={{ flex: 1, overflowY: 'auto', margin: '1rem 0', color: '#666' }}>
                        <p>How can I help you with your career trajectory today?</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Chatbot;
