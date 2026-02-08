import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm Aria, your Career GPS Assistant. How can I help you navigate your career trajectory today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const API_BASE_URL = 'http://localhost:5000/api';
            const res = await axios.post(`${API_BASE_URL}/chat/ask`, {
                message: input,
                history: messages.slice(-5) // Send last 5 messages for context
            });

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
        } finally {
            setLoading(false);
        }
    };

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
                    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                    color: 'white',
                    fontSize: '1.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                }}
            >
                {isOpen ? '×' : '💬'}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: 0,
                    width: '350px',
                    height: '500px',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                        color: 'white'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Aria - Career GPS</h3>
                        <p style={{ margin: '5px 0 0', fontSize: '0.75rem', opacity: 0.8 }}>AI-Powered Careers Intelligence</p>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', background: '#F8FAFC' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '12px 16px',
                                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                background: msg.role === 'user' ? '#6366F1' : 'white',
                                color: msg.role === 'user' ? 'white' : '#1E293B',
                                fontSize: '0.9rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                border: msg.role === 'user' ? 'none' : '1px solid #E2E8F0'
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', padding: '10px 15px', background: 'white', borderRadius: '15px', color: '#64748B', fontSize: '0.8rem', italic: 'true' }}>
                                Aria is thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{ padding: '1.2rem', background: 'white', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Ask about your career..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '10px 15px',
                                borderRadius: '10px',
                                background: '#6366F1',
                                color: 'white',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            ➔
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
