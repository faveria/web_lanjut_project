const { PlantProfile, UserPlantSetting, User } = require('../models');
const { Op } = require('sequelize');

// Get all available plant profiles
const getAllPlantProfiles = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let whereClause = {};

    // Filter by category if provided
    if (category) {
      whereClause.category = category;
    }

    // Filter by difficulty if provided
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    // Search by name if provided
    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`
      };
    }

    const plantProfiles = await PlantProfile.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: plantProfiles
    });
  } catch (error) {
    console.error('Get all plant profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single plant profile by ID
const getPlantProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const plantProfile = await PlantProfile.findByPk(id);

    if (!plantProfile) {
      return res.status(404).json({
        success: false,
        message: 'Plant profile not found'
      });
    }

    res.json({
      success: true,
      data: plantProfile
    });
  } catch (error) {
    console.error('Get plant profile by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's plant settings
const getUserPlantSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to access their own plant settings
    if (req.user.id !== parseInt(userId) && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userPlantSettings = await UserPlantSetting.findAll({
      where: { 
        userId: userId,
        isActive: true
      },
      include: [{
        model: PlantProfile,
        as: 'PlantProfile'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: userPlantSettings
    });
  } catch (error) {
    console.error('Get user plant settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add plant to user's settings
const addUserPlant = async (req, res) => {
  try {
    const { userId } = req.params;
    const { plantProfileId, growthPhase, plantedDate, notes } = req.body;
    
    // Only allow users to manage their own plants
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify plant profile exists
    const plantProfile = await PlantProfile.findByPk(plantProfileId);
    if (!plantProfile) {
      return res.status(404).json({
        success: false,
        message: 'Plant profile not found'
      });
    }

    // Check if user already has this plant active
    const existingPlant = await UserPlantSetting.findOne({
      where: {
        userId: userId,
        plantProfileId: plantProfileId,
        isActive: true
      }
    });

    if (existingPlant) {
      return res.status(400).json({
        success: false,
        message: 'This plant is already in your active garden'
      });
    }

    // Calculate expected harvest date if planted date is provided
    let expectedHarvestDate = null;
    if (plantedDate && plantProfile.growthTime) {
      const planted = new Date(plantedDate);
      expectedHarvestDate = new Date(planted.getTime() + (plantProfile.growthTime * 24 * 60 * 60 * 1000));
    }

    const userPlantSetting = await UserPlantSetting.create({
      userId: userId,
      plantProfileId: plantProfileId,
      growthPhase: growthPhase || 'seedling',
      plantedDate: plantedDate || new Date(),
      expectedHarvestDate,
      notes: notes || '',
      isActive: true
    });

    // Include the plant profile in the response
    await userPlantSetting.reload({
      include: [{
        model: PlantProfile,
        as: 'PlantProfile'
      }]
    });

    res.json({
      success: true,
      message: 'Plant added to your garden successfully',
      data: userPlantSetting
    });
  } catch (error) {
    console.error('Add user plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user's plant setting
const updateUserPlant = async (req, res) => {
  try {
    const { userId, userPlantSettingId } = req.params;
    const { growthPhase, notes, isActive } = req.body;
    
    // Only allow users to manage their own plants
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userPlantSetting = await UserPlantSetting.findOne({
      where: {
        id: userPlantSettingId,
        userId: userId
      }
    });

    if (!userPlantSetting) {
      return res.status(404).json({
        success: false,
        message: 'Plant setting not found'
      });
    }

    // Update the plant setting
    await userPlantSetting.update({
      growthPhase: growthPhase !== undefined ? growthPhase : userPlantSetting.growthPhase,
      notes: notes !== undefined ? notes : userPlantSetting.notes,
      isActive: isActive !== undefined ? isActive : userPlantSetting.isActive
    });

    // Include the plant profile in the response
    await userPlantSetting.reload({
      include: [{
        model: PlantProfile,
        as: 'PlantProfile'
      }]
    });

    res.json({
      success: true,
      message: 'Plant setting updated successfully',
      data: userPlantSetting
    });
  } catch (error) {
    console.error('Update user plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Remove plant from user's settings
const removeUserPlant = async (req, res) => {
  try {
    const { userId, userPlantSettingId } = req.params;
    
    // Only allow users to manage their own plants
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userPlantSetting = await UserPlantSetting.findOne({
      where: {
        id: userPlantSettingId,
        userId: userId
      }
    });

    if (!userPlantSetting) {
      return res.status(404).json({
        success: false,
        message: 'Plant setting not found'
      });
    }

    // Instead of deleting, set isActive to false
    await userPlantSetting.update({ isActive: false });

    res.json({
      success: true,
      message: 'Plant removed from your garden successfully'
    });
  } catch (error) {
    console.error('Remove user plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's active plant settings with their optimal parameters
const getUserPlantOptimalParameters = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to access their own plant settings
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userPlantSettings = await UserPlantSetting.findAll({
      where: { 
        userId: userId,
        isActive: true
      },
      include: [{
        model: PlantProfile,
        as: 'PlantProfile'
      }],
      order: [['createdAt', 'DESC']]
    });

    // Transform to return optimal parameters for active plants
    const optimalParameters = userPlantSettings.map(setting => ({
      id: setting.id,
      plantName: setting.PlantProfile.name,
      growthPhase: setting.growthPhase,
      optimalParameters: {
        ph: {
          min: setting.PlantProfile.optimalPhMin,
          max: setting.PlantProfile.optimalPhMax
        },
        tds: {
          min: setting.PlantProfile.optimalTdsMin,
          max: setting.PlantProfile.optimalTdsMax
        },
        waterTemp: {
          min: setting.PlantProfile.optimalWaterTempMin,
          max: setting.PlantProfile.optimalWaterTempMax
        },
        airTemp: {
          min: setting.PlantProfile.optimalAirTempMin,
          max: setting.PlantProfile.optimalAirTempMax
        },
        humidity: {
          min: setting.PlantProfile.optimalHumidityMin,
          max: setting.PlantProfile.optimalHumidityMax
        }
      },
      plantedDate: setting.plantedDate,
      expectedHarvestDate: setting.expectedHarvestDate
    }));

    res.json({
      success: true,
      data: optimalParameters
    });
  } catch (error) {
    console.error('Get user plant optimal parameters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllPlantProfiles,
  getPlantProfileById,
  getUserPlantSettings,
  addUserPlant,
  updateUserPlant,
  removeUserPlant,
  getUserPlantOptimalParameters
};