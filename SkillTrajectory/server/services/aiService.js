import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const mainGroq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const interviewGroq = new Groq({ apiKey: process.env.GROQ_API_INTERVIEW || process.env.GROQ_API_KEY });
const groq = mainGroq;

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
        Skills: ${JSON.stringify(
        Array.isArray(userProfile.skills)
            ? userProfile.skills.map(s => s.name)
            : []
    )}

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

export const getSkillGapAnalysis = async (userProfile, targetRole) => {
    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Skills: ${JSON.stringify(userProfile.skills)}
        Years of Experience: ${userProfile.yearsOfExperience}
        
        Target Role: ${targetRole || 'Next Strategic Level'}

        Task: Perform a detailed skill gap analysis between the user's current profile and the target role.
        
        Return in strict JSON format with the following structure:
        {
            "averageGap": number (e.g. 22),
            "criticalSprints": number (e.g. 3, estimated sprints to bridge gaps),
            "readinessScore": number (e.g. 78),
            "skills": [
                {
                    "name": "Skill Name",
                    "currentLevel": number (0-100),
                    "targetLevel": number (0-100, higher than current),
                    "gap": number (difference),
                    "priority": "LOW PRIORITY" | "MEDIUM PRIORITY" | "HIGH PRIORITY",
                    "action": "Bridge This Gap"
                },
                ... (5-8 key skills)
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

export const getRecommendedCourses = async (userProfile, filters) => {
    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Skills: ${JSON.stringify(userProfile.skills)}
        Skill Gaps: (Analyse based on common gaps for current vs next level role)
        
        Filters:
        Target Skill: ${filters?.targetSkill || 'Any'}
        Provider: ${filters?.provider || 'Any'}
        Duration: ${filters?.duration || 'Any'}

        Task: Recommend 6-9 HIGHLY RELEVANT, REALISTIC courses from major platforms (Udemy, Coursera, Pluralsight, LinkedIn Learning, EdX).
        Ensure the titles and providers are real. 
        
        Return in strict JSON format with the following structure:
        {
            "courses": [
                {
                    "title": "Course Title",
                    "provider": "Udemy" | "Coursera" | "Pluralsight" | "LinkedIn Learning" | "EdX",
                    "level": "Beginner" | "Intermediate" | "Advanced",
                    "rating": number (e.g. 4.7),
                    "students": number (e.g. 12000),
                    "duration": "string (e.g. 10 hours)",
                    "price": "string (e.g. $19.99 or Free)",
                    "url": "Search URL",
                    "tags": ["Tag1", "Tag2"]
                },
                ...
            ]
        }
    `;

    try {
        console.log("Fetching recommended courses with filters:", filters); // Log input for debugging
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

        const content = chatCompletion.choices[0].message.content;
        if (!content) {
            throw new Error("Received empty response from Groq API");
        }

        const data = JSON.parse(content);

        // Validate data structure
        if (!data.courses || !Array.isArray(data.courses)) {
            console.error("Invalid response format from AI:", data);
            // Return fallback or empty array instead of crashing
            return { courses: [] };
        }

        data.courses = data.courses.map(course => ({
            ...course,
            url: course.url || `https://www.google.com/search?q=${encodeURIComponent(course.title + ' ' + (course.provider || '') + ' course')}&btnI=1`
        }));

        return data;

    } catch (error) {
        console.error("Groq API Error in getRecommendedCourses:", error);
        // Return structured error or empty list to frontend to handle gracefully
        throw new Error(`AI Service Error: ${error.message}`);
    }
};

export const getStudyVelocityInsights = async (courses, weeklyHours) => {
    const prompt = `
        Courses: ${JSON.stringify(courses.map(c => ({ title: c.title, provider: c.provider, duration: c.duration })))}
        Weekly Commitment: ${weeklyHours} hours/week

        Task: Analyze the study velocity and provide learning insights.
        
        Return in strict JSON format with the following structure:
        {
            "strategy": "Strategy Name (e.g. Consistent Builder, Weekend Warrior)",
            "advice": "Short strategic advice based on hours.",
            "riskCheck": {
                "status": "Sustainable" | "Risky" | "Aggressive",
                "message": "Brief risk assessment."
            },
            "timeAllocation": {
                "technical": number (percentage 0-100),
                "tools": number (percentage 0-100),
                "leadership": number (percentage 0-100)
            },
            "backlogAnalysis": [
                {
                    "courseTitle": "Matches input course title",
                    "totalEffort": number (estimated hours),
                    "impactOnPath": number (percentage 0-100),
                    "category": "Technical" | "Tools" | "Leadership"
                }
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

export const getMarketDemandTrends = async (userProfile) => {
    const prompt = `User Profile: Current Role: ${userProfile.currentRole}, Skills: ${JSON.stringify(userProfile.skills)}, Years of Experience: ${userProfile.yearsOfExperience}. Task: Generate comprehensive market demand trends and insights for this user's skill set. Return in strict JSON format with the following structure: keyMetrics (topSkillGrowth with skill/percentage/trend, averageSkills, activeJobs, jobPostings with count/unit/trend), demandCurve array with month/demand, topGrowthSkills array with name/growth, decliningSkills array with name/decline (negative growth percentage), trendingSkills array with name/category/demand/trend/jobCount/avgSalary/salaryUnit, marketPositioning array with skill/userLevel/marketDemand/gapToDoor/jobCount/avgSalary/salaryUnit.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error in getMarketDemandTrends:", error);
        throw new Error(`AI Service Error: ${error.message}`);
    }
};


export const getSkillDecayAnalysis = async (userProfile) => {
    // Extract all skills from technical and soft arrays
    const allSkills = [
        ...(userProfile.skills?.technical || []),
        ...(userProfile.skills?.soft || [])
    ];

    const prompt = `User Profile: Current Role: ${userProfile.currentRole}, Skills: ${JSON.stringify(allSkills)}, Years of Experience: ${userProfile.yearsOfExperience}. Task: Generate comprehensive skill decay analysis. Return in strict JSON format with: 
    {
        "aggregateTrend": array (5 months with month/proficiency), 
        "knowledgeMatrix": { "tech": number, "business": number, "context": number }, 
        "environments": array (3 environments with name/description), 
        "skillDecay": array (user's top 6 skills with name, 
            "environmentMetrics": {
                [environmentName]: {
                    "currentRate": number,
                    "halfLife": "X yrs" | "X months",
                    "status": "LEARN_OBSOLESCENCE" | "EVIDENT_ATROPHY" | "NEAR_PEAK_RATE",
                    "decayTrend": array (5 months with value)
                }
            },
            "contentIntegrity": number
        )
    }
    The environmentMetrics should have keys matching the names in the environments array.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error in getSkillDecayAnalysis:", error);
        throw new Error(`AI Service Error: ${error.message}`);
    }
};

export const getFairnessMetrics = async (userProfile) => {
    const allSkills = [
        ...(userProfile.skills?.technical || []),
        ...(userProfile.skills?.soft || [])
    ];

    const prompt = `User Profile: Current Role: ${userProfile.currentRole}, Skills: ${JSON.stringify(allSkills)}, Years of Experience: ${userProfile.yearsOfExperience}. Task: Generate comprehensive fairness and inclusion metrics for this user's career trajectory and location. Return in strict JSON format with the following structure:
    {
        "demographicParity": [
            { "category": "Gender", "parityScore": number (0-100), "status": "Optimized" | "Alert" | "Critical" },
            { "category": "Ethnicity", "parityScore": number (0-100), "status": "Optimized" | "Alert" | "Critical" },
            { "category": "Age", "parityScore": number (0-100), "status": "Optimized" | "Alert" | "Critical" }
        ],
        "skillAccessibility": [
            { "subject": "Open Source", "value": number (0-100) },
            { "subject": "Paid Certs", "value": number (0-100) },
            { "subject": "Networking", "value": number (0-100) },
            { "subject": "Mentorship", "value": number (0-100) },
            { "subject": "Bootcamps", "value": number (0-100) }
        ],
        "biasDetection": {
            "recommendationBias": number (0-100),
            "opportunityGap": number (0-100),
            "salaryEquity": number (0-100)
        },
        "regionalMapping": [
            { "region": "North America", "opportunity": number },
            { "region": "Europe", "opportunity": number },
            { "region": "Asia Pacific", "opportunity": number },
            { "region": "LATAM", "opportunity": number },
            { "region": "Africa", "opportunity": number }
        ],
        "inclusionIndex": number (0-100)
    }`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error in getFairnessMetrics:", error);
        throw new Error(`AI Service Error: ${error.message}`);
    }
};

export const getJobOpenings = async (userProfile, targetRole) => {
    const allSkills = Array.isArray(userProfile.skills)
        ? userProfile.skills.map(s => s.name)
        : [];

    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Skills: ${JSON.stringify(allSkills)}
        Target Path: ${targetRole}

        Task: Generate 6 highly relevant, real-time simulated job openings that align with the user's TARGET role while leveraging their CURRENT skills and learnings.
        
        Return in strict JSON format with:
        {
            "jobs": [
                {
                    "title": string (e.g., Senior Full Stack Engineer),
                    "company": string (e.g., TechNova Solutions),
                    "location": string (e.g., New York, NY | Remote),
                    "salary": string (e.g., $140k - $180k),
                    "matchScore": number (60-100),
                    "whyYouFit": string (1-2 sentences highlighting specific user skills),
                    "skillsRequired": string[],
                    "type": "Full-time" | "Contract" | "Remote",
                    "applyUrl": string (A robust LinkedIn or Indeed SEARCH URL for this specific role and company to ensure the link always shows active results)
                }
            ]
        }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error in getJobOpenings:", error);
        throw new Error(`AI Service Error: ${error.message}`);
    }
};

export const getSkillWastageJobs = async (userProfile) => {
    const microSkills = Array.isArray(userProfile.skills?.soft)
        ? userProfile.skills.soft.map(s => s.name)
        : [];

    const technicalSkills = Array.isArray(userProfile.skills?.technical)
        ? userProfile.skills.technical.map(s => s.name)
        : [];

    const prompt = `
        User Profile:
        Current Role: ${userProfile.currentRole}
        Technical Skills: ${JSON.stringify(technicalSkills)}
        Micro-Skills (Soft Skills): ${JSON.stringify(microSkills)}

        Task: Generate 6 highly relevant, real-time simulated job openings specifically in the GOVT or NGO sectors.
        Crucial Focus: These jobs should prioritize the user's MICRO-SKILLS (soft skills like leadership, communication, strategic planning) which are often underutilized ("wasted") in purely technical roles.
        
        Return in strict JSON format with:
        {
            "jobs": [
                {
                    "title": string (e.g., Program Director, Public Policy Analyst),
                    "organization": string (e.g., United Nations, Dept of Education),
                    "location": string (e.g., Washington, DC | Remote),
                    "sector": "Government" | "NGO" | "Public Sector",
                    "impactScore": number (80-100),
                    "whyYouFit": string (Explain how their technical background + micro-skills make them unique for this public service role),
                    "skillsValued": string[],
                    "salary": string (Estimated salary or 'Grade Level'),
                    "applyUrl": string (A robust LinkedIn or Indeed SEARCH URL for this specific role and organization)
                }
            ]
        }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error in getSkillWastageJobs:", error);
        throw new Error(`AI Service Error: ${error.message}`);
    }
};

export const getInterviewQuestion = async (topic, userProfile, history = []) => {
    const prompt = `
        You are an elite female corporate interviewer named "Aria". 
        Topic: ${topic}
        User Context: ${JSON.stringify(userProfile)}
        Interview History: ${JSON.stringify(history)}

        Task: Generate the NEXT interview question for the user. 
        Style: Professional, sharp, but encouraging. 
        Constraint: **Be extremely concise.** Your question and transition MUST be no more than 1-2 sentences.
        Adaptive Logic:
        - If 'History' contains answers, your NEXT question should be a "Drill-down". 
        - Pick a specific detail, technical claim, or behavioral situation from the LAST answer and ask for more depth, a counter-example, or an edge case.
        - Persona Context: You are "Aria". You are sharp, observant, and you don't let vague answers slide.
        - Briefly acknowledge the last point made before pivoting into the deep-dive question.
        
        Return in strict JSON format:
        {
            "question": string (Include the conversational transition/acknowledgment here),
            "type": "TECHNICAL" | "BEHAVIORAL" | "SITUATIONAL",
            "context": string (Briefly explain why you are asking this)
        }
    `;

    try {
        const chatCompletion = await interviewGroq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq Interview Error (getInterviewQuestion):", error);
        throw new Error(`Interview AI Error: ${error.message}`);
    }
};

export const analyzeInterviewResponse = async (question, answer, userProfile) => {
    const prompt = `
        You are "Aria", an expert interview coach.
        Question Asked: ${question}
        User's Answer: ${answer}
        User Profile: ${JSON.stringify(userProfile)}

        Task: Analyze the user's answer and provide detailed feedback.
        Special Context: The user is in "Training Mode". 
        Constraint: **Be extremely concise.** Your feedback field MUST be no more than 1-2 sentences. 
        Persona Style: Interactive & Conversational.
        - Start feedback with conversational fillers like "Hmm," "I see," "Interesting," or "That's a valid perspective."
        - Be reactive to the user's tone. If they sound confident, challenge them. If they sound unsure, be more encouraging.
        - If the user's answer is weak, nonsensical, or they say "I don't know", you MUST provide a "simpleExplanation" field explaining the core concept.
        - Analyze simulated behavioral aspects based on the answer text structure (Confidence, Eye Contact, Body Language).
        
        Return in strict JSON format:
        {
            "scores": {
                "technical": number,
                "clarity": number,
                "impact": number
            },
            "behaviorAnalysis": {
                "confidence": number (0-100),
                "eyeContact": number (0-100),
                "bodyLanguage": number (0-100),
                "reasoning": string
            },
            "feedback": string (Aria's spoken response),
            "simpleExplanation": string (A simple, encouraging explanation for training purposes. Only populate if needed),
            "suggestions": string[],
            "isSatisfactory": boolean,
            "nextStep": string
        }
    `;

    try {
        const chatCompletion = await interviewGroq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq Interview Error (analyzeInterviewResponse):", error);
        throw new Error(`Interview AI Error: ${error.message}`);
    }
};
