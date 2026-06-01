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

const generateOutreach = async (resumeData, jobDescription, jobTitle, companyName, analysisData) => {
  try {
    const resumeSummary = `Skills: ${resumeData.extractedSkills?.join(', ') || 'None listed'}
Projects: ${resumeData.projects?.join(', ') || 'None listed'}
Education: ${resumeData.education?.join(', ') || 'None listed'}
Experience: ${resumeData.experience?.join(', ') || 'None listed'}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert recruiter outreach specialist, career communications coach, and hiring manager with 20+ years of experience. You write messages that sound human, get responses, and land interviews. You never use AI-sounding language. Return valid JSON only, no markdown, no backticks.`
        },
        {
          role: 'user',
          content: `Generate outreach messages for a candidate applying to a job.

ROLE: ${jobTitle || 'the position'}
COMPANY: ${companyName || 'the company'}

JOB DESCRIPTION:
${jobDescription}

MY BACKGROUND:
${resumeSummary}

ANALYSIS:
Matched Skills: ${analysisData.matchedSkills?.join(', ') || 'None'}
Strengths: ${analysisData.strengths?.join(', ') || 'None'}

---

PART 1: LINKEDIN DMs

Act as a recruiter outreach expert.

I am applying for the following role: ${jobTitle || 'the position'}
Company: ${companyName || 'the company'}

Write LinkedIn DMs to the recruiter that:
- Are under 150 words each
- Do not sound AI-generated
- Immediately demonstrate that I researched the company
- Connect my experience to the company's goals
- Highlight the most relevant achievement from my background
- Create curiosity about my profile
- Sound confident but not desperate
- Avoid generic phrases like "I hope you're doing well"
- End with a soft call-to-action
- Focus on the impact I can create for the company rather than what I want from them

Provide exactly 3 versions:
1. A professional version
2. A slightly casual version
3. A bold version that stands out

---

PART 2: COLD EMAIL

Act as a senior recruiter and hiring manager.

I want to send a cold job application email for ${jobTitle || 'the position'} at ${companyName || 'the company'}.

Write an email that:
- Has a highly clickable subject line
- Is personalized to the company's mission and work
- Shows that I understand their challenges
- Explains how my skills can contribute to their growth
- Includes specific projects from my background
- Focuses on business impact, not just skills
- Sounds natural and human
- Is concise (200-250 words)
- Ends with a clear but respectful CTA

After writing the email, also explain:
- Why the email would get a recruiter's attention
- Which lines create the strongest impact

---

PART 3: COVER LETTER

Act as an experienced hiring manager.

Write a recruiter-friendly cover letter for ${jobTitle || 'the position'} at ${companyName || 'the company'} that:
- Is personalized to the company
- Shows deep understanding of the role
- Connects my projects and experience directly to the job requirements
- Focuses on achievements and outcomes rather than responsibilities
- Demonstrates problem-solving ability
- Explains why I am excited about THIS company specifically
- Sounds confident and authentic
- Avoids generic cover letter language
- Is approximately 400-500 words

Structure:
1. Strong opening hook
2. Why this company
3. Why I am a good fit
4. Key achievements and projects
5. Future impact I can create
6. Strong closing

Provide 2 versions:
- ATS-friendly version (clean, keyword-rich, structured)
- Human-friendly version (conversational, story-driven, engaging)

---

Return JSON ONLY in this exact format. All values must be plain strings:
{
  "linkedinProfessional": "string - professional LinkedIn DM",
  "linkedinCasual": "string - casual LinkedIn DM",
  "linkedinBold": "string - bold LinkedIn DM",
  "emailSubject": "string - the email subject line only",
  "emailBody": "string - the full email body including greeting and sign-off",
  "emailExplanation": "string - why this email works and which lines create impact",
  "coverLetterAts": "string - ATS-friendly cover letter",
  "coverLetterHuman": "string - human-friendly cover letter"
}`
        }
      ],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Groq outreach error:', error.message);
    throw error;
  }
};

module.exports = { extractResumeData, analyzeJobFit, generateOutreach };
