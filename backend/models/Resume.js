const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  extractedSkills: [{
    type: String
  }],
  projects: [{
    type: String
  }],
  education: [{
    type: String
  }],
  experience: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
