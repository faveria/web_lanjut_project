const express = require('express');
const { getLatestData, getHistory, controlPump } = require('../controllers/dataController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/latest', authenticateToken, getLatestData);
router.get('/history', authenticateToken, getHistory);
router.post('/control-pump', authenticateToken, controlPump);

module.exports = router;