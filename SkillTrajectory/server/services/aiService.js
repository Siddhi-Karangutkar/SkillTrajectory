import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const getCareerInsights = async (userProfile, targetRole) => {
    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Skills: ${JSON.stringify(userProfile.skills)}
        Years of Experience: ${userProfile.yearsOfExperience}
        Experience History: ${JSON.stringify(userProfile.experience)}
        Constraints: ${JSON.stringify(userProfile.constraints)}

        Target Role: ${targetRole}

        Task: Provide a detailed career trajectory from the current role to the target role.
        
        Return in strict JSON format with the following structure:
        {
            "fitScore": number,
            "skillGaps": string[],
            "roadmap": [
                {
                    "label": "Phase 1: Now",
                    "title": string,
                    "subtitle": string,
                    "description": string,
                    "skills": string[],
                    "duration": "Present"
                },
                ... (6 phases total)
            ],
            "salaryProjections": {
                "base": number,
                "potential": number
            },
            "aiDisplacementRisk": string
        }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};

export const getSectorTransitions = async (userProfile) => {
    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Skills: ${JSON.stringify(userProfile.skills)}

        Task: Analyze career pivot opportunities into 4 major sectors: FinTech, HealthTech, EdTech, RetailTech.
        
        Return in strict JSON format with the following structure:
        {
            "sectors": [
                {
                    "name": "FinTech",
                    "match": number,
                    "description": string,
                    "transferableSkills": string[],
                    "bridgeSkills": string[],
                    "difficulty": "Low" | "Medium" | "Hard",
                    "salaryUpside": number
                },
                ...
            ]
        }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};

export const getSimulationData = async (userProfile, parameters) => {
    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Skills: ${JSON.stringify(userProfile.skills)}

        Simulation Parameters:
        Target Path: ${parameters.targetPath}
        Learning Investment: ${parameters.learningHours} hrs/week
        Time Horizon: ${parameters.timeHorizon} years

        Task: Simulate the career trajectory based on these parameters.
        
        Return in strict JSON format with the following structure:
        {
            "yearByYearSalaryGrowthData": [
                {"year": "Year 1", "salary": number, "baseline": number},
                ...
            ],
            "detailedAiRiskBreakdown": {
                "Routine Tasks": number,
                "High-Level Tasks": number,
                "Strategic Planning": number,
                "Creative Tasks": number
            },
            "volatilityScore": "Low" | "Medium" | "High",
            "burnoutRisk": "Low" | "Moderate" | "High" | "Critical",
            "projectedSalaryUpside": number
        }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};

export const getRoleRecommendations = async (userProfile) => {
    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Skills: ${JSON.stringify(userProfile.skills)}
        Years of Experience: ${userProfile.yearsOfExperience} years

        Task: Recommend the top 4 strategic career roles for this user.
        
        Return in strict JSON format with the following structure:
        {
            "recommendations": [
                {
                    "title": string,
                    "category": string,
                    "fitScore": number,
                    "prepWindow": string,
                    "salaryRange": string,
                    "whyRole": string,
                    "skills": [{"name": string, "isReady": boolean}, ...]
                },
                ...
            ]
        }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};
