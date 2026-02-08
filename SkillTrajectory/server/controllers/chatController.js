import { getChatResponse } from '../services/aiService.js';

export const askChatbot = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await getChatResponse(message, history || []);
        res.json({ response });
    } catch (error) {
        console.error('Chat Controller Error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};
