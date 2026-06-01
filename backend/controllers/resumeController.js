const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { extractResumeData } = require('../services/openai');

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

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    const aiData = await extractResumeData(extractedText);

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      extractedText: extractedText,
      extractedSkills: flattenToStrings(aiData.skills || []),
      projects: flattenToStrings(aiData.projects || []),
      education: flattenToStrings(aiData.education || []),
      experience: flattenToStrings(aiData.experience || [])
    });

    fs.unlinkSync(filePath);

    res.status(201).json({
      _id: resume._id,
      fileName: resume.fileName,
      extractedSkills: resume.extractedSkills,
      projects: resume.projects,
      education: resume.education,
      experience: resume.experience
    });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: `Error processing resume: ${error.message}` });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadResume, getResumes };
