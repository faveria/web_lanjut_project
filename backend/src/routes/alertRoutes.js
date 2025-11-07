const express = require('express');
const { 
  getUserAlerts,
  resolveAlert,
  getActiveAlerts
} = require('../controllers/alertController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// User-specific alert routes - require authentication
router.get('/user/:userId', authenticateToken, getUserAlerts);
router.get('/user/:userId/active', authenticateToken, getActiveAlerts);
router.put('/user/:userId/:alertId/resolve', authenticateToken, resolveAlert);

module.exports = router;