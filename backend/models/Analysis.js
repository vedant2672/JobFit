const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobTitle: {
    type: String,
    default: 'Untitled Position'
  },
  companyName: {
    type: String,
    default: ''
  },
  jobDescription: {
    type: String,
    required: true
  },
  jobFitScore: {
    type: Number,
    default: 0
  },
  matchedSkills: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  strengths: [{
    type: String
  }],
  weaknesses: [{
    type: String
  }],
  recommendedProjects: [{
    type: String
  }],
  roadmap: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Analysis', analysisSchema);
