const { Alert, User, PlantProfile, SensorData, UserPlantSetting } = require('../models');
const { Op } = require('sequelize');

// Get user's alerts
const getUserAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { severity, type, isResolved, limit = 50 } = req.query;
    
    // Only allow users to access their own alerts
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let whereClause = { userId: userId };

    // Filter by severity if provided
    if (severity) {
      whereClause.severity = severity;
    }

    // Filter by type if provided
    if (type) {
      whereClause.type = type;
    }

    // Filter by resolved status if provided
    if (isResolved !== undefined) {
      whereClause.isResolved = isResolved === 'true' || isResolved === true;
    }

    const alerts = await Alert.findAll({
      where: whereClause,
      include: [
        {
          model: PlantProfile,
          as: 'PlantProfile',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get user alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mark alert as resolved
const resolveAlert = async (req, res) => {
  try {
    const { userId, alertId } = req.params;
    const { resolvedBy } = req.body;
    
    // Only allow users to resolve their own alerts
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const alert = await Alert.findByPk(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if this alert belongs to the user
    if (alert.userId !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await alert.update({
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy: resolvedBy || req.user.id
    });

    res.json({
      success: true,
      message: 'Alert marked as resolved successfully',
      data: alert
    });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new alert (for internal use)
const createAlert = async (req, res) => {
  try {
    const { userId, plantProfileId, type, severity, title, message, parameterName, currentValue, thresholdValue, actionRequired, sensorDataId } = req.body;

    const alert = await Alert.create({
      userId,
      plantProfileId,
      type,
      severity,
      title,
      message,
      parameterName,
      currentValue,
      thresholdValue,
      actionRequired,
      sensorDataId
    });

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get active alerts for a user
const getActiveAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to access their own alerts
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const activeAlerts = await Alert.findAll({
      where: {
        userId: userId,
        isResolved: false
      },
      include: [
        {
          model: PlantProfile,
          as: 'PlantProfile',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['severity', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: activeAlerts
    });
  } catch (error) {
    console.error('Get active alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Generate alerts based on sensor data and plant profiles
const generateAlerts = async (sensorData, userId) => {
  try {
    // Get user's active plant settings with their optimal parameters
    const userPlantSettings = await UserPlantSetting.findAll({
      where: {
        userId: userId,
        isActive: true
      },
      include: [{
        model: PlantProfile,
        as: 'PlantProfile'
      }]
    });

    if (!userPlantSettings || userPlantSettings.length === 0) {
      // If user has no specific plants, fall back to general system thresholds
      await generateSystemAlerts(sensorData, userId);
      return;
    }

    // Generate alerts based on plant-specific optimal ranges
    const now = new Date();
    for (const setting of userPlantSettings) {
      const plant = setting.PlantProfile;
      
      // Check pH levels
      if (sensorData.ph !== null && sensorData.ph !== undefined) {
        if (sensorData.ph < plant.optimalPhMin) {
          await createParameterAlert(userId, setting.plantProfileId, 'pH', sensorData.ph, plant.optimalPhMin, 'low', sensorData.id);
        } else if (sensorData.ph > plant.optimalPhMax) {
          await createParameterAlert(userId, setting.plantProfileId, 'pH', sensorData.ph, plant.optimalPhMax, 'high', sensorData.id);
        }
      }

      // Check TDS levels
      if (sensorData.tds !== null && sensorData.tds !== undefined) {
        if (sensorData.tds < plant.optimalTdsMin) {
          await createParameterAlert(userId, setting.plantProfileId, 'TDS', sensorData.tds, plant.optimalTdsMin, 'low', sensorData.id);
        } else if (sensorData.tds > plant.optimalTdsMax) {
          await createParameterAlert(userId, setting.plantProfileId, 'TDS', sensorData.tds, plant.optimalTdsMax, 'high', sensorData.id);
        }
      }

      // Check water temperature
      if (sensorData.suhu_air !== null && sensorData.suhu_air !== undefined) {
        if (sensorData.suhu_air < plant.optimalWaterTempMin) {
          await createParameterAlert(userId, setting.plantProfileId, 'Water Temperature', sensorData.suhu_air, plant.optimalWaterTempMin, 'low', sensorData.id);
        } else if (sensorData.suhu_air > plant.optimalWaterTempMax) {
          await createParameterAlert(userId, setting.plantProfileId, 'Water Temperature', sensorData.suhu_air, plant.optimalWaterTempMax, 'high', sensorData.id);
        }
      }

      // Check air temperature
      if (sensorData.suhu_udara !== null && sensorData.suhu_udara !== undefined) {
        if (sensorData.suhu_udara < plant.optimalAirTempMin) {
          await createParameterAlert(userId, setting.plantProfileId, 'Air Temperature', sensorData.suhu_udara, plant.optimalAirTempMin, 'low', sensorData.id);
        } else if (sensorData.suhu_udara > plant.optimalAirTempMax) {
          await createParameterAlert(userId, setting.plantProfileId, 'Air Temperature', sensorData.suhu_udara, plant.optimalAirTempMax, 'high', sensorData.id);
        }
      }

      // Check humidity
      if (sensorData.kelembapan !== null && sensorData.kelembapan !== undefined) {
        if (sensorData.kelembapan < plant.optimalHumidityMin) {
          await createParameterAlert(userId, setting.plantProfileId, 'Humidity', sensorData.kelembapan, plant.optimalHumidityMin, 'low', sensorData.id);
        } else if (sensorData.kelembapan > plant.optimalHumidityMax) {
          await createParameterAlert(userId, setting.plantProfileId, 'Humidity', sensorData.kelembapan, plant.optimalHumidityMax, 'high', sensorData.id);
        }
      }
    }
  } catch (error) {
    console.error('Generate alerts error:', error);
  }
};

// Helper function to generate system alerts when no specific plants are set
const generateSystemAlerts = async (sensorData, userId) => {
  try {
    // Use default thresholds since no specific plants are selected
    const defaultThresholds = {
      ph: { min: 5.5, max: 7.5 },
      tds: { min: 500, max: 1500 },
      waterTemp: { min: 18, max: 28 },
      airTemp: { min: 20, max: 30 },
      humidity: { min: 40, max: 80 }
    };

    const now = new Date();

    // Check pH levels
    if (sensorData.ph !== null && sensorData.ph !== undefined) {
      if (sensorData.ph < defaultThresholds.ph.min) {
        await createParameterAlert(userId, null, 'pH', sensorData.ph, defaultThresholds.ph.min, 'low', sensorData.id, 'system');
      } else if (sensorData.ph > defaultThresholds.ph.max) {
        await createParameterAlert(userId, null, 'pH', sensorData.ph, defaultThresholds.ph.max, 'high', sensorData.id, 'system');
      }
    }

    // Check TDS levels
    if (sensorData.tds !== null && sensorData.tds !== undefined) {
      if (sensorData.tds < defaultThresholds.tds.min) {
        await createParameterAlert(userId, null, 'TDS', sensorData.tds, defaultThresholds.tds.min, 'low', sensorData.id, 'system');
      } else if (sensorData.tds > defaultThresholds.tds.max) {
        await createParameterAlert(userId, null, 'TDS', sensorData.tds, defaultThresholds.tds.max, 'high', sensorData.id, 'system');
      }
    }

    // Check water temperature
    if (sensorData.suhu_air !== null && sensorData.suhu_air !== undefined) {
      if (sensorData.suhu_air < defaultThresholds.waterTemp.min) {
        await createParameterAlert(userId, null, 'Water Temperature', sensorData.suhu_air, defaultThresholds.waterTemp.min, 'low', sensorData.id, 'system');
      } else if (sensorData.suhu_air > defaultThresholds.waterTemp.max) {
        await createParameterAlert(userId, null, 'Water Temperature', sensorData.suhu_air, defaultThresholds.waterTemp.max, 'high', sensorData.id, 'system');
      }
    }

    // Check air temperature
    if (sensorData.suhu_udara !== null && sensorData.suhu_udara !== undefined) {
      if (sensorData.suhu_udara < defaultThresholds.airTemp.min) {
        await createParameterAlert(userId, null, 'Air Temperature', sensorData.suhu_udara, defaultThresholds.airTemp.min, 'low', sensorData.id, 'system');
      } else if (sensorData.suhu_udara > defaultThresholds.airTemp.max) {
        await createParameterAlert(userId, null, 'Air Temperature', sensorData.suhu_udara, defaultThresholds.airTemp.max, 'high', sensorData.id, 'system');
      }
    }

    // Check humidity
    if (sensorData.kelembapan !== null && sensorData.kelembapan !== undefined) {
      if (sensorData.kelembapan < defaultThresholds.humidity.min) {
        await createParameterAlert(userId, null, 'Humidity', sensorData.kelembapan, defaultThresholds.humidity.min, 'low', sensorData.id, 'system');
      } else if (sensorData.kelembapan > defaultThresholds.humidity.max) {
        await createParameterAlert(userId, null, 'Humidity', sensorData.kelembapan, defaultThresholds.humidity.max, 'high', sensorData.id, 'system');
      }
    }
  } catch (error) {
    console.error('Generate system alerts error:', error);
  }
};

// Helper function to create a parameter alert
const createParameterAlert = async (userId, plantProfileId, parameterName, currentValue, thresholdValue, deviationType, sensorDataId, alertType = 'plant') => {
  try {
    // Check if a similar unresolved alert already exists
    const existingAlert = await Alert.findOne({
      where: {
        userId,
        parameterName,
        isResolved: false
      }
    });

    if (existingAlert) {
      // If the same alert exists and is still unresolved, don't create a duplicate
      return;
    }

    let severity = 'low';
    let title = '';
    let message = '';
    let actionRequired = '';

    // Determine severity based on how far off the value is
    const percentageDeviation = Math.abs((currentValue - thresholdValue) / thresholdValue) * 100;
    
    if (percentageDeviation > 20) {
      severity = 'critical';
    } else if (percentageDeviation > 10) {
      severity = 'high';
    } else {
      severity = 'medium';
    }

    // Set title and message based on parameter and deviation
    const plantInfo = plantProfileId ? 
      (await PlantProfile.findByPk(plantProfileId, { attributes: ['name'] })) : 
      null;
    
    const plantName = plantInfo ? ` for ${plantInfo.name}` : '';

    switch (parameterName.toLowerCase()) {
      case 'ph':
        title = `${parameterName} Level Alert${plantName}`;
        message = `${parameterName} is ${deviationType} (${currentValue}) for your plants. Optimal range: ${thresholdValue}`;
        actionRequired = `Adjust pH levels using pH up/down solutions. Check nutrient solution.`;
        break;
      case 'tds':
        title = `${parameterName} Level Alert${plantName}`;
        message = `${parameterName} is ${deviationType} (${currentValue}) for your plants. Optimal range: ${thresholdValue}`;
        actionRequired = `Adjust nutrient concentration. Check EC/ppm meter calibration.`;
        break;
      case 'water temperature':
      case 'suhu_air':
        title = `Water Temperature Alert${plantName}`;
        message = `Water temperature is ${deviationType} (${currentValue}°C) for your plants. Optimal range: ${thresholdValue}°C`;
        actionRequired = `Use water chiller/heater or adjust environmental conditions.`;
        break;
      case 'air temperature':
      case 'suhu_udara':
        title = `Air Temperature Alert${plantName}`;
        message = `Air temperature is ${deviationType} (${currentValue}°C) for your plants. Optimal range: ${thresholdValue}°C`;
        actionRequired = `Adjust HVAC system or use fans to regulate temperature.`;
        break;
      case 'humidity':
      case 'kelembapan':
        title = `Humidity Alert${plantName}`;
        message = `Humidity is ${deviationType} (${currentValue}%) for your plants. Optimal range: ${thresholdValue}%`;
        actionRequired = `Use humidifier/dehumidifier or improve air circulation.`;
        break;
      default:
        title = `${parameterName} Alert${plantName}`;
        message = `${parameterName} is ${deviationType} (${currentValue}). Optimal: ${thresholdValue}`;
        actionRequired = `Check sensor calibration and adjust environmental conditions.`;
    }

    // Create the alert
    const alert = await Alert.create({
      userId,
      plantProfileId,
      type: alertType,
      severity,
      title,
      message,
      parameterName,
      currentValue,
      thresholdValue,
      actionRequired,
      sensorDataId
    });

    return alert;
  } catch (error) {
    console.error('Create parameter alert error:', error);
  }
};

module.exports = {
  getUserAlerts,
  resolveAlert,
  createAlert,
  getActiveAlerts,
  generateAlerts
};