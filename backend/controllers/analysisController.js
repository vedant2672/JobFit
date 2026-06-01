const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const { analyzeJobFit, generateOutreach } = require('../services/openai');

const flattenToStrings = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return Object.values(item)
        .filter(v => typeof v === 'string' || typeof v === 'number')
        .join(' - ');
    }
    return String(item);
  });
};

const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobDescription, jobTitle, companyName } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: 'Please provide resume ID and job description' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const analysisResult = await analyzeJobFit(resume, jobDescription);

    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      jobTitle: jobTitle || 'Untitled Position',
      companyName: companyName || '',
      jobDescription: jobDescription,
      jobFitScore: analysisResult.jobFitScore || 0,
      matchedSkills: flattenToStrings(analysisResult.matchedSkills || []),
      missingSkills: flattenToStrings(analysisResult.missingSkills || []),
      strengths: flattenToStrings(analysisResult.strengths || []),
      weaknesses: flattenToStrings(analysisResult.weaknesses || []),
      recommendedProjects: flattenToStrings(analysisResult.recommendedProjects || []),
      roadmap: flattenToStrings(analysisResult.roadmap || [])
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error creating analysis: ${error.message}` });
  }
};

const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-jobDescription');
    res.json(analyses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateOutreachMessages = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const resume = await Resume.findOne({ _id: analysis.resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const outreach = await generateOutreach(
      resume,
      analysis.jobDescription,
      analysis.jobTitle,
      analysis.companyName,
      {
        jobFitScore: analysis.jobFitScore,
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        strengths: analysis.strengths
      }
    );

    res.json(outreach);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error generating outreach: ${error.message}` });
  }
};

module.exports = { createAnalysis, getAnalysisHistory, getAnalysisById, generateOutreachMessages };
