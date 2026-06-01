const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const extractResumeData = async (text) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. Extract information from resumes and return valid JSON only. No markdown, no backticks.'
        },
        {
          role: 'user',
          content: `Analyze the resume below and extract the following information:

1. Skills
2. Projects
3. Education
4. Experience

Resume Text:
${text}

CRITICAL RULES:
- EVERY item in projects, education, and experience MUST be a single plain string, NOT an object.
- Do NOT use objects like {name, description, technologies}. Use a single descriptive string instead.
- Example of correct format: "ProConnect - Professional Networking Platform built with MERN Stack"
- Example of correct education: "B.Tech in Computer Science & Engineering from TMU Moradabad, CGPA: 7.8/10, 2022-2026"
- Example of correct experience: "Data Analytics Virtual Intern at Tata Forage, Sep-Oct 2025 - Analyzed customer datasets"

Return valid JSON only in this exact format:
{
  "skills": ["skill1", "skill2"],
  "projects": ["project1 description", "project2 description"],
  "education": ["education1 details"],
  "experience": ["experience1 details"]
}`
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      skills: [],
      projects: [],
      education: [],
      experience: []
    };
  } catch (error) {
    console.error('Groq extraction error:', error.message);
    throw error;
  }
};

const analyzeJobFit = async (resumeData, jobDescription) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter and career coach. Compare resumes with job descriptions and provide detailed analysis. Return valid JSON only. No markdown, no backticks.'
        },
        {
          role: 'user',
          content: `Compare the resume with the job description below.

Resume Data:
Skills: ${resumeData.extractedSkills?.join(', ') || 'None listed'}
Projects: ${resumeData.projects?.join(', ') || 'None listed'}
Education: ${resumeData.education?.join(', ') || 'None listed'}
Experience: ${resumeData.experience?.join(', ') || 'None listed'}

Job Description:
${jobDescription}

Calculate a Job Fit Score between 0 and 100.

Identify:
1. Matched Skills
2. Missing Skills
3. Candidate Strengths
4. Candidate Weaknesses
5. Recommended Projects to improve fit
6. Learning Roadmap (week by week)

Return JSON ONLY in this exact format. Every field must contain plain strings, NOT objects:
{
  "jobFitScore": 0,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendedProjects": ["project1 description", "project2 description"],
  "roadmap": ["Week 1: topic - description", "Week 2: topic - description"]
}

CRITICAL: Every item in every array MUST be a single plain string. Do NOT use objects like {week, topic, tasks}. Combine everything into one string per item. For roadmap, format as "Week N: topic - key tasks".`
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Groq analysis error:', error.message);
    throw error;
  }
};

module.exports = { extractResumeData, analyzeJobFit };
