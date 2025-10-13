const express = require('express');
const { getLatestData, getHistory } = require('../controllers/dataController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/latest', authenticateToken, getLatestData);
router.get('/history', authenticateToken, getHistory);

module.exports = router;