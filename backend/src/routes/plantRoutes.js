const express = require('express');
const { 
  getAllPlantProfiles, 
  getPlantProfileById,
  getUserPlantSettings,
  addUserPlant,
  updateUserPlant,
  removeUserPlant,
  getUserPlantOptimalParameters
} = require('../controllers/plantController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes - get all plant profiles and individual plant profile
router.get('/', getAllPlantProfiles);
router.get('/:id', getPlantProfileById);

// User-specific routes - require authentication
router.get('/user/:userId/plants', authenticateToken, getUserPlantSettings);
router.post('/user/:userId/plants', authenticateToken, addUserPlant);
router.put('/user/:userId/plants/:userPlantSettingId', authenticateToken, updateUserPlant);
router.delete('/user/:userId/plants/:userPlantSettingId', authenticateToken, removeUserPlant);
router.get('/user/:userId/optimal-parameters', authenticateToken, getUserPlantOptimalParameters);

module.exports = router;