const express = require('express');
const { 
  getGrowthRecommendations
} = require('../controllers/recommendationController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// User-specific recommendation routes - require authentication
router.get('/user/:userId', authenticateToken, getGrowthRecommendations);

module.exports = router;