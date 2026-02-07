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

