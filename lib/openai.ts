import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Resume Analysis ──────────────────────────────────────────────────────────

export async function analyzeResume(resumeText: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert ATS resume analyzer. Analyze the provided resume and return a JSON object with:
- atsScore (0-100): ATS compatibility score
- skills: array of detected skills
- missingSkills: array of commonly expected skills not found
- strengths: array of resume strengths
- improvements: array of specific improvement suggestions
- summary: brief overall assessment
Return ONLY valid JSON, no markdown.`,
      },
      { role: "user", content: `Analyze this resume:\n\n${resumeText}` },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1500,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

// ── Job Match Score ──────────────────────────────────────────────────────────

export async function calculateJobMatch(
  candidateSkills: string[],
  jobRequirements: string,
  candidateExperience: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a talent matching AI. Calculate match scores and return JSON with:
- overallScore (0-100): overall compatibility
- skillMatch (0-100): skills alignment score
- experienceMatch (0-100): experience alignment
- matchedSkills: array of matched skills
- missingSkills: array of required skills the candidate lacks
- recommendation: brief recommendation string
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Candidate Skills: ${candidateSkills.join(", ")}
Experience: ${candidateExperience}
Job Requirements: ${jobRequirements}`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 800,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

// ── Skill Gap Analysis ───────────────────────────────────────────────────────

export async function analyzeSkillGap(
  candidateSkills: string[],
  targetRole: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a career development AI. Analyze skill gaps and return JSON with:
- missingSkills: array of {skill, priority: "high"|"medium"|"low", reason}
- suggestedCourses: array of {title, platform, url, duration}
- estimatedTimeToReady: string (e.g., "3-6 months")
- careerPath: array of milestone strings
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Current Skills: ${candidateSkills.join(", ")}
Target Role: ${targetRole}`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1200,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

// ── Career Chatbot ───────────────────────────────────────────────────────────

export async function careerChatCompletion(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are SkillBridge Career Advisor — an expert AI career coach. You help job seekers with:
- Resume writing and optimization
- Interview preparation and mock interviews
- Career path planning
- Salary negotiation advice
- Job search strategies
- Professional development
Be concise, practical, and encouraging. Use bullet points for clarity.`,
      },
      ...messages,
    ],
    max_tokens: 800,
    stream: false,
  });

  return response.choices[0].message.content || "";
}

// ── Job Description Generator ─────────────────────────────────────────────────

export async function generateJobDescription(jobInfo: {
  title: string;
  company: string;
  skills: string[];
  level: string;
  type: string;
  location: string;
}) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert HR writer. Generate a professional job description and return JSON with:
- description: engaging job overview (2-3 paragraphs)
- responsibilities: array of 6-8 key responsibilities
- requirements: array of 5-7 requirements
- benefits: array of 4-6 benefits
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Create a job description for:
Title: ${jobInfo.title}
Company: ${jobInfo.company}
Required Skills: ${jobInfo.skills.join(", ")}
Level: ${jobInfo.level}
Type: ${jobInfo.type}
Location: ${jobInfo.location}`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1500,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export default openai;
