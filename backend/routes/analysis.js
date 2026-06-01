const express = require('express');
const router = express.Router();
const { createAnalysis, getAnalysisHistory, getAnalysisById, generateOutreachMessages } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createAnalysis);
router.get('/history', protect, getAnalysisHistory);
router.get('/:id', protect, getAnalysisById);
router.post('/:id/outreach', protect, generateOutreachMessages);

module.exports = router;
