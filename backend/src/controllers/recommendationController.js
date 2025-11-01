const { UserPlantSetting, PlantProfile, SensorData, Alert } = require('../models');
const { Op } = require('sequelize');

// Get personalized growth recommendations for user's plants
const getGrowthRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to access their own recommendations
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get user's active plant settings with plant profiles
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

    if (!userPlantSettings || userPlantSettings.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No active plants found. Add plants to your garden to receive recommendations.'
      });
    }

    // Get the latest sensor data
    const latestSensorData = await SensorData.findOne({
      order: [['created_at', 'DESC']]
    });

    // Generate recommendations for each active plant
    const recommendations = [];
    for (const setting of userPlantSettings) {
      const plant = setting.PlantProfile;
      const plantRecommendations = await generatePlantRecommendations(setting, plant, latestSensorData);
      
      if (plantRecommendations.length > 0) {
        recommendations.push({
          plantId: plant.id,
          plantName: plant.name,
          growthPhase: setting.growthPhase,
          recommendations: plantRecommendations
        });
      }
    }

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get growth recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to generate recommendations for a specific plant
const generatePlantRecommendations = async (userPlantSetting, plantProfile, sensorData) => {
  const recommendations = [];

  // If we don't have sensor data yet, provide general recommendations based on growth phase
  if (!sensorData) {
    recommendations.push({
      type: 'system',
      priority: 'info',
      title: 'Waiting for Sensor Data',
      recommendation: 'Connect your sensor system to receive real-time recommendations based on current conditions.',
      action: 'Ensure your sensor is properly connected and transmitting data.'
    });

    return recommendations;
  }

  // Check pH levels
  if (sensorData.ph !== null && sensorData.ph !== undefined) {
    if (sensorData.ph < plantProfile.optimalPhMin) {
      recommendations.push({
        type: 'pH',
        priority: 'high',
        title: 'pH Adjustment Needed',
        recommendation: `Current pH level (${sensorData.ph}) is below the optimal range for ${plantProfile.name}.`,
        action: `Add pH up solution gradually until pH reaches optimal range (${plantProfile.optimalPhMin}-${plantProfile.optimalPhMax}).`
      });
    } else if (sensorData.ph > plantProfile.optimalPhMax) {
      recommendations.push({
        type: 'pH',
        priority: 'high',
        title: 'pH Adjustment Needed',
        recommendation: `Current pH level (${sensorData.ph}) is above the optimal range for ${plantProfile.name}.`,
        action: `Add pH down solution gradually until pH reaches optimal range (${plantProfile.optimalPhMin}-${plantProfile.optimalPhMax}).`
      });
    } else {
      recommendations.push({
        type: 'pH',
        priority: 'low',
        title: 'pH Levels Optimal',
        recommendation: `pH level (${sensorData.ph}) is within the optimal range for ${plantProfile.name}.`,
        action: 'Continue monitoring pH levels daily to maintain consistency.'
      });
    }
  }

  // Check TDS levels
  if (sensorData.tds !== null && sensorData.tds !== undefined) {
    if (sensorData.tds < plantProfile.optimalTdsMin) {
      recommendations.push({
        type: 'nutrients',
        priority: 'high',
        title: 'Nutrient Concentration Low',
        recommendation: `TDS level (${sensorData.tds}) is below the optimal range for ${plantProfile.name}.`,
        action: `Increase nutrient solution concentration to reach optimal range (${plantProfile.optimalTdsMin}-${plantProfile.optimalTdsMax} ppm).`
      });
    } else if (sensorData.tds > plantProfile.optimalTdsMax) {
      recommendations.push({
        type: 'nutrients',
        priority: 'high',
        title: 'Nutrient Concentration High',
        recommendation: `TDS level (${sensorData.tds}) is above the optimal range for ${plantProfile.name}.`,
        action: `Dilute nutrient solution or add fresh water to reach optimal range (${plantProfile.optimalTdsMin}-${plantProfile.optimalTdsMax} ppm).`
      });
    } else {
      recommendations.push({
        type: 'nutrients',
        priority: 'low',
        title: 'Nutrient Levels Optimal',
        recommendation: `TDS level (${sensorData.tds}) is within the optimal range for ${plantProfile.name}.`,
        action: 'Maintain current nutrient solution strength.'
      });
    }
  }

  // Check water temperature
  if (sensorData.suhu_air !== null && sensorData.suhu_air !== undefined) {
    if (sensorData.suhu_air < plantProfile.optimalWaterTempMin) {
      recommendations.push({
        type: 'temperature',
        priority: 'medium',
        title: 'Water Temperature Low',
        recommendation: `Water temperature (${sensorData.suhu_air}°C) is below the optimal range for ${plantProfile.name}.`,
        action: `Use a water heater or increase ambient temperature to reach optimal range (${plantProfile.optimalWaterTempMin}-${plantProfile.optimalWaterTempMax}°C).`
      });
    } else if (sensorData.suhu_air > plantProfile.optimalWaterTempMax) {
      recommendations.push({
        type: 'temperature',
        priority: 'medium',
        title: 'Water Temperature High',
        recommendation: `Water temperature (${sensorData.suhu_air}°C) is above the optimal range for ${plantProfile.name}.`,
        action: `Use a water chiller or increase air circulation to reach optimal range (${plantProfile.optimalWaterTempMin}-${plantProfile.optimalWaterTempMax}°C).`
      });
    } else {
      recommendations.push({
        type: 'temperature',
        priority: 'low',
        title: 'Water Temperature Optimal',
        recommendation: `Water temperature (${sensorData.suhu_air}°C) is within the optimal range for ${plantProfile.name}.`,
        action: 'Continue monitoring to maintain consistent water temperature.'
      });
    }
  }

  // Check air temperature
  if (sensorData.suhu_udara !== null && sensorData.suhu_udara !== undefined) {
    if (sensorData.suhu_udara < plantProfile.optimalAirTempMin) {
      recommendations.push({
        type: 'temperature',
        priority: 'medium',
        title: 'Air Temperature Low',
        recommendation: `Air temperature (${sensorData.suhu_udara}°C) is below the optimal range for ${plantProfile.name}.`,
        action: `Use heaters or adjust environmental controls to reach optimal range (${plantProfile.optimalAirTempMin}-${plantProfile.optimalAirTempMax}°C).`
      });
    } else if (sensorData.suhu_udara > plantProfile.optimalAirTempMax) {
      recommendations.push({
        type: 'temperature',
        priority: 'medium',
        title: 'Air Temperature High',
        recommendation: `Air temperature (${sensorData.suhu_udara}°C) is above the optimal range for ${plantProfile.name}.`,
        action: `Use air conditioning, fans, or increase ventilation to reach optimal range (${plantProfile.optimalAirTempMin}-${plantProfile.optimalAirTempMax}°C).`
      });
    } else {
      recommendations.push({
        type: 'temperature',
        priority: 'low',
        title: 'Air Temperature Optimal',
        recommendation: `Air temperature (${sensorData.suhu_udara}°C) is within the optimal range for ${plantProfile.name}.`,
        action: 'Maintain current environmental conditions.'
      });
    }
  }

  // Check humidity
  if (sensorData.kelembapan !== null && sensorData.kelembapan !== undefined) {
    if (sensorData.kelembapan < plantProfile.optimalHumidityMin) {
      recommendations.push({
        type: 'humidity',
        priority: 'medium',
        title: 'Humidity Low',
        recommendation: `Humidity (${sensorData.kelembapan}%) is below the optimal range for ${plantProfile.name}.`,
        action: `Use humidifiers or misting systems to increase humidity to optimal range (${plantProfile.optimalHumidityMin}-${plantProfile.optimalHumidityMax}%).`
      });
    } else if (sensorData.kelembapan > plantProfile.optimalHumidityMax) {
      recommendations.push({
        type: 'humidity',
        priority: 'medium',
        title: 'Humidity High',
        recommendation: `Humidity (${sensorData.kelembapan}%) is above the optimal range for ${plantProfile.name}.`,
        action: `Use dehumidifiers or increase air circulation to reach optimal range (${plantProfile.optimalHumidityMin}-${plantProfile.optimalHumidityMax}%).`
      });
    } else {
      recommendations.push({
        type: 'humidity',
        priority: 'low',
        title: 'Humidity Optimal',
        recommendation: `Humidity (${sensorData.kelembapan}%) is within the optimal range for ${plantProfile.name}.`,
        action: 'Continue monitoring to maintain optimal humidity levels.'
      });
    }
  }

  // Growth phase specific recommendations
  if (userPlantSetting.growthPhase) {
    const phaseRecommendations = getGrowthPhaseRecommendations(userPlantSetting.growthPhase, plantProfile, userPlantSetting);
    recommendations.push(...phaseRecommendations);
  }

  // Get any recent unresolved alerts for additional recommendations
  const recentAlerts = await Alert.findAll({
    where: {
      userId: userPlantSetting.userId,
      isResolved: false,
      createdAt: {
        [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      }
    },
    order: [['createdAt', 'DESC']]
  });

  if (recentAlerts.length > 0) {
    recommendations.push({
      type: 'system',
      priority: 'high',
      title: 'Unresolved System Alerts',
      recommendation: `You have ${recentAlerts.length} unresolved alerts that need attention.`,
      action: 'Review and resolve active alerts to maintain optimal growing conditions.'
    });
  }

  return recommendations;
};

// Helper function for growth phase recommendations
const getGrowthPhaseRecommendations = (growthPhase, plantProfile, userPlantSetting) => {
  const recommendations = [];
  
  switch (growthPhase) {
    case 'seedling':
      recommendations.push({
        type: 'growth-phase',
        priority: 'medium',
        title: 'Seedling Stage Care',
        recommendation: `Your ${plantProfile.name} is in the seedling stage. Focus on gentle lighting and consistent moisture.`,
        action: 'Provide 14-16 hours of gentle light and ensure nutrients are diluted to 1/4 strength.'
      });
      break;
    case 'vegetative':
      recommendations.push({
        type: 'growth-phase',
        priority: 'medium',
        title: 'Vegetative Stage Optimization',
        recommendation: `Your ${plantProfile.name} is in the vegetative stage. Ensure strong root development and leaf growth.`,
        action: 'Monitor nutrient levels and adjust to vegetative-specific ratios. Prune as needed.'
      });
      break;
    case 'flowering':
      recommendations.push({
        type: 'growth-phase',
        priority: 'medium',
        title: 'Flowering Stage Requirements',
        recommendation: `Your ${plantProfile.name} is in the flowering stage. Nutrient requirements have changed.`,
        action: 'Switch to bloom-specific nutrients. Adjust lighting schedule if applicable.'
      });
      break;
    case 'harvest':
      recommendations.push({
        type: 'growth-phase',
        priority: 'medium',
        title: 'Harvest Time Approaching',
        recommendation: `Your ${plantProfile.name} is approaching harvest time, estimated on ${userPlantSetting.expectedHarvestDate}.`,
        action: 'Begin preparations for harvest. Monitor for signs of readiness.'
      });
      break;
  }

  return recommendations;
};

module.exports = {
  getGrowthRecommendations
};