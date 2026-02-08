import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const AIInterview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Session State
    const [step, setStep] = useState('setup'); // 'setup', 'interview', 'feedback'
    const [topic, setTopic] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [history, setHistory] = useState([]);

    // Interview Flow State
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [lastFeedback, setLastFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAriaSpeaking, setIsAriaSpeaking] = useState(false);
    const [ariaAvatar] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000');
    const [stream, setStream] = useState(null);
    const [isPreparingNext, setIsPreparingNext] = useState(false);

    // Refs
    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const isListeningRef = useRef(false);
    const lastSpokenQuestionRef = useRef(null);

    // Keep ref in sync for onend handler
    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    // State-driven STT Lifecycle Manager
    useEffect(() => {
        if (isListening && recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                // Ignore if already started
                if (e.name !== 'InvalidStateError') console.error('STT Start Error:', e);
            }
        }
    }, [isListening]);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                console.log('Speech recognition started');
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                console.log('Speech captured:', transcript);
                setUserAnswer(transcript);
            };

            recognition.onend = () => {
                console.log('Speech recognition ended. isListeningRef:', isListeningRef.current);
                // Auto-restart if we are still in "listening" mode (e.g. silence timeout)
                if (isListeningRef.current) {
                    try {
                        recognition.start();
                    } catch (e) {
                        // Already started or busy
                    }
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    alert('Microphone access is blocked. Please check browser permissions.');
                    setIsListening(false);
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Handle Persistent Video Stream
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, step]);

    // Unified TTS Logic with Promise Support
    const speak = (text) => {
        return new Promise((resolve) => {
            if (!text) return resolve();
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            const setVoice = () => {
                const voices = window.speechSynthesis.getVoices();
                // Priority list for female voices
                const femaleVoices = voices.filter(v =>
                    v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('samantha') ||
                    v.name.toLowerCase().includes('victoria') ||
                    v.name.toLowerCase().includes('google uk english female') ||
                    v.name.toLowerCase().includes('zira')
                );

                if (femaleVoices.length > 0) {
                    utterance.voice = femaleVoices[0];
                }
            };

            setVoice();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = setVoice;
            }

            utterance.rate = 1.05;
            utterance.pitch = 1.1;

            utterance.onstart = () => setIsAriaSpeaking(true);
            utterance.onend = () => {
                setIsAriaSpeaking(false);
                resolve();
            };
            utterance.onerror = (e) => {
                console.error('Speech synthesis error:', e);
                setIsAriaSpeaking(false);
                resolve();
            };

            window.speechSynthesis.speak(utterance);
        });
    };

    // Sequential Feedback Remover (No longer needed since we handle in submit)
    useEffect(() => {
        if (step === 'interview' && currentQuestion && lastSpokenQuestionRef.current !== currentQuestion.question) {
            // This is for the VERY FIRST question only now
            if (history.length === 0) {
                setTimeout(() => {
                    speak(currentQuestion.question);
                    lastSpokenQuestionRef.current = currentQuestion.question;
                    // Automatically start listening for first question
                    setTimeout(() => setIsListening(true), 1500);
                }, 800);
            }
        }
    }, [currentQuestion, step, history.length]);

    const startCamera = async () => {
        try {
            console.log('Requesting camera and microphone access...');
            const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(s);
            setIsCameraActive(true);
            console.log('Hardware access granted.');
        } catch (error) {
            console.error('Error accessing camera/mic:', error);
            let userMessage = 'Please enable camera and microphone access to proceed.';

            if (error.name === 'NotAllowedError') {
                userMessage = 'Permission denied. Please click the camera icon in your browser address bar to allow access.';
            } else if (error.name === 'NotFoundError') {
                userMessage = 'No camera or microphone found. Please connect your hardware and try again.';
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                userMessage = 'Camera or Mic is already in use by another application. Please close other apps and try again.';
            }

            alert(`Access Error (${error.name}): ${userMessage}\n\nDetails: ${error.message}`);
        }
    };

    const handleStartInterview = async () => {
        if (!topic) return alert('Please enter a topic for the interview.');
        setLoading(true);
        try {
            const token = user?.token;
            console.log('Starting interview with topic:', topic, 'Token present:', !!token);

            const res = await axios.post(`${API_BASE_URL}/interview/start`,
                { topic },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCurrentQuestion(res.data.question);
            setStep('interview');
        } catch (error) {
            console.error('Error starting interview:', error);
            const status = error.response?.status;
            if (status === 401) {
                alert('Your session has expired or is invalid. Please log out and log back in.');
            } else {
                alert(`Failed to start interview: ${error.message}. Please check if the server is running on port 5000.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setUserAnswer('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!userAnswer) return alert('Please speak or type your answer before submitting.');

        console.log('Finalizing submission. Answer length:', userAnswer.length);
        setLoading(true);

        // Stop listening and wait a moment for final transcripts to commit
        if (isListening) {
            setIsListening(false);
            if (recognitionRef.current) recognitionRef.current.stop();
            await new Promise(resolve => setTimeout(resolve, 500)); // Buffer for STT finalization
        }

        // Conversational "Thinking" Bridge (Snappy version)
        const thinkingCues = [
            "Analyzing...",
            "Hmm, let me think...",
            "Processing your answer...",
            "Wait, let me analyze that..."
        ];
        const cue = thinkingCues[Math.floor(Math.random() * thinkingCues.length)];
        speak(cue);

        try {
            const token = user?.token;
            const res = await axios.post(`${API_BASE_URL}/interview/submit`,
                {
                    topic,
                    question: currentQuestion.question,
                    answer: userAnswer,
                    history
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = res.data;
            setHistory(prev => [...prev, { q: currentQuestion.question, a: userAnswer }]);
            setUserAnswer('');

            // 1. Speak Feedback
            const feedbackText = data.feedback.feedback;
            let combinedFeedback = feedbackText;
            if (data.feedback.simpleExplanation) {
                combinedFeedback += `. To help you learn: ${data.feedback.simpleExplanation}`;
            }

            setLastFeedback(data.feedback);
            await speak(combinedFeedback);

            // 2. Transition and Speak Next Question
            if (data.nextQuestion) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Pause for reflection
                setCurrentQuestion(data.nextQuestion);
                lastSpokenQuestionRef.current = data.nextQuestion.question;
                await speak(data.nextQuestion.question);

                // 3. Auto-start listening after Aria finishes
                setIsListening(true);
            } else {
                setStep('feedback');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer. Your session might have expired.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const token = user?.token;
            await axios.post(`${API_BASE_URL}/interview/finish`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStep('complete');
        } catch (error) {
            console.error('Error finishing interview:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '120px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1E293B' }}>i Interview 👩‍💼</h1>
                    <p style={{ color: '#64748B', fontSize: '1.2rem' }}>Powered by Aria AI Assistant</p>
                </div>

                {step === 'setup' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            background: '#FFF',
                            padding: '3rem',
                            borderRadius: '32px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            border: '1px solid #E2E8F0'
                        }}
                    >
                        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800' }}>Session Setup</h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#475569' }}>Interview Topic</label>
                            <input
                                type="text"
                                placeholder="e.g. React Senior Developer, Marketing Manager..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '2px solid #E2E8F0',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            {isCameraActive ? (
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    background: '#000',
                                    marginBottom: '1rem',
                                    border: '4px solid #F0FDF4',
                                    position: 'relative'
                                }}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                    />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#15803D', color: '#FFF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '900' }}>
                                        LIVE PREVIEW
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={startCamera}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px dashed #CBD5E1',
                                        background: '#F8FAFC',
                                        color: '#64748B',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📸 Test Camera & Mic
                                </button>
                            )}
                            {!isCameraActive && (
                                <p style={{ fontSize: '0.8rem', color: '#EF4444', marginTop: '8px', fontWeight: '700' }}>
                                    ⚠️ Camera and Microphone access is required to start.
                                </p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartInterview}
                            disabled={loading || !topic || !isCameraActive}
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '16px',
                                background: '#2563EB',
                                color: '#FFF',
                                border: 'none',
                                fontWeight: '900',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                opacity: (!topic || !isCameraActive) ? 0.5 : 1
                            }}
                        >
                            {loading ? 'Entering Session...' : 'Start Virtual Interview'}
                        </motion.button>
                    </motion.div>
                )}

                {step === 'interview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>

                        {/* Main Session View */}
                        <div>
                            <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', background: '#000', height: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                                {/* Aria Avatar */}
                                <img
                                    src={ariaAvatar}
                                    alt="Aria"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center 20%', // Ensure head is visible, not just chest/lips
                                        filter: isAriaSpeaking ? 'brightness(1.1) contrast(1.1)' : 'brightness(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />

                                {/* Aria Overlay (Simulated Persona) */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '30px',
                                    right: '30px',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(15px)',
                                    padding: '1.5rem 2rem',
                                    borderRadius: '24px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    border: isAriaSpeaking ? '2px solid #6366F1' : '1px solid #E2E8F0'
                                }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#FFF',
                                                fontSize: '1.5rem',
                                                flexShrink: 0
                                            }}>
                                                👩‍💼
                                            </div>
                                            {isAriaSpeaking && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        borderRadius: '50%',
                                                        border: '4px solid #6366F1'
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {isAriaSpeaking ? 'Aria is Speaking...' : 'Aria (AI Interviewer)'}
                                            </span>
                                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B', marginTop: '2px' }}>{currentQuestion?.question}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Self View (Picture-in-Picture) */}
                                <div style={{
                                    position: 'absolute',
                                    top: '30px',
                                    right: '30px',
                                    width: '180px',
                                    height: '240px',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: '4px solid #FFF',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                    background: '#000'
                                }}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                    />

                                    {/* Behavioral HUD */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            {[
                                                { label: 'CONFIDENCE', val: lastFeedback?.behaviorAnalysis?.confidence || 85, color: '#10B981' },
                                                { label: 'EYE CONTACT', val: lastFeedback?.behaviorAnalysis?.eyeContact || 92, color: '#3B82F6' },
                                                { label: 'BODY POSTURE', val: lastFeedback?.behaviorAnalysis?.bodyLanguage || 88, color: '#F59E0B' }
                                            ].map((m, i) => (
                                                <div key={i} style={{ width: '100%' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.5rem', color: '#FFF', fontWeight: '900', marginBottom: '2px' }}>
                                                        <span>{m.label}</span>
                                                        <span>{m.val}%</span>
                                                    </div>
                                                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${m.val}%` }}
                                                            style={{ height: '100%', background: m.color, borderRadius: '2px' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.5)', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: '700' }}>
                                        YOU (LIVE)
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div style={{ marginTop: '2rem', background: '#FFF', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '800', color: '#475569' }}>Your Answer:</label>
                                    <textarea
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Click on the mic to speak or type your answer here..."
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            padding: '20px',
                                            borderRadius: '16px',
                                            border: '2px solid #F1F5F9',
                                            fontSize: '1.1rem',
                                            outline: 'none',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleListening}
                                        style={{
                                            padding: '16px 32px',
                                            borderRadius: '16px',
                                            background: isListening ? '#EF4444' : '#F1F5F9',
                                            color: isListening ? '#FFF' : '#475569',
                                            border: 'none',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        {isListening ? '🛑 Stop Listening' : '🎙️ Speak Answer'}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSubmitAnswer}
                                        disabled={loading || !userAnswer || isAriaSpeaking}
                                        style={{
                                            flex: 1,
                                            padding: '16px 32px',
                                            borderRadius: '16px',
                                            background: '#2563EB',
                                            color: '#FFF',
                                            border: 'none',
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            opacity: (loading || isAriaSpeaking) ? 0.7 : 1
                                        }}
                                    >
                                        {loading ? 'Aria is analyzing...' : 'Submit Response'}
                                    </motion.button>


                                    <button
                                        onClick={handleFinish}
                                        style={{ padding: '16px 24px', borderRadius: '16px', border: '2px solid #F1F5F9', background: 'none', color: '#EF4444', fontWeight: '800', cursor: 'pointer' }}
                                    >
                                        End Session
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Feedback & Stats */}
                        <div>
                            <div style={{ background: '#FFF', padding: '2rem', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', height: '100%', overflowY: 'auto' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1E293B', marginBottom: '2rem' }}>Interview Coaching</h3>

                                {lastFeedback ? (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={history.length}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                                                <div style={{ textAlign: 'center', padding: '15px', background: '#F8FAFC', borderRadius: '16px' }}>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#6366F1' }}>{lastFeedback.scores.technical}</span>
                                                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748B', fontWeight: '800' }}>TECHNICAL</span>
                                                </div>
                                                <div style={{ textAlign: 'center', padding: '15px', background: '#F8FAFC', borderRadius: '16px' }}>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#8B5CF6' }}>{lastFeedback.scores.clarity}</span>
                                                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748B', fontWeight: '800' }}>CLARITY</span>
                                                </div>
                                                <div style={{ textAlign: 'center', padding: '15px', background: '#F8FAFC', borderRadius: '16px' }}>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#EC4899' }}>{lastFeedback.scores.impact}</span>
                                                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748B', fontWeight: '800' }}>IMPACT</span>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '2rem' }}>
                                                <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#475569', marginBottom: '10px', textTransform: 'uppercase' }}>Aria's Feedback</h4>
                                                <p style={{ fontSize: '0.95rem', color: '#1E293B', lineHeight: '1.6', background: '#F0F9FF', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #0EA5E9' }}>
                                                    "{lastFeedback.feedback}"
                                                </p>
                                            </div>

                                            <div>
                                                <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#475569', marginBottom: '10px', textTransform: 'uppercase' }}>Behavioral Tips</h4>
                                                <ul style={{ paddingLeft: '20px', color: '#64748B', fontSize: '0.9rem' }}>
                                                    {lastFeedback.suggestions.map((tip, i) => (
                                                        <li key={i} style={{ marginBottom: '8px' }}>{tip}</li>
                                                    ))}
                                                    <li style={{ marginBottom: '8px' }}>Maintain eye contact with the lens.</li>
                                                    <li style={{ marginBottom: '8px' }}>Try to lean in slightly for impact.</li>
                                                </ul>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⏳</div>
                                        <p>Feedback will appear after your first response.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 'complete' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
                    >
                        <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🏆</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1E293B', marginBottom: '1rem' }}>Interview Ready!</h2>
                        <p style={{ fontSize: '1.25rem', color: '#64748B', marginBottom: '3rem' }}>You've successfully completed the session. Aria has awarded you **100 Bonus Trajectory XP**.</p>

                        <div style={{ background: '#FFF', padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', marginBottom: '3rem', textAlign: 'left' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Overall Journey Breakdown</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>AVERAGE SCORE</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#2563EB' }}>
                                        {history.length > 0
                                            ? Math.round(history.reduce((acc, h) => acc + h.feedback.scores.technical, 0) / history.length)
                                            : 0}%
                                    </span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>QUESTIONS ANSWERED</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1E293B' }}>{history.length}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{ padding: '20px 40px', borderRadius: '16px', background: '#1E293B', color: '#FFF', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                        >
                            Back to Trajectory Dashboard
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIInterview;
