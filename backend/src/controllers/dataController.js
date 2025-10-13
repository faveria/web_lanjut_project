const { SensorData } = require('../models');

const getLatestData = async (req, res) => {
  try {
    const latestData = await SensorData.findOne({
      order: [['created_at', 'DESC']]
    });

    if (!latestData) {
      return res.status(404).json({
        success: false,
        message: 'No sensor data found'
      });
    }

    res.json({
      success: true,
      data: latestData
    });
  } catch (error) {
    console.error('Get latest data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await SensorData.findAll({
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: history.reverse() // Reverse untuk urutan ascending (oldest first)
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Fungsi untuk menangani data MQTT
const saveSensorData = async (sensorData) => {
  try {
    const { suhu_air, suhu_udara, kelembapan, tds } = sensorData;
    
    const newData = await SensorData.create({
      suhu_air,
      suhu_udara,
      kelembapan,
      tds,
      created_at: new Date()
    });

    console.log('✅ Sensor data saved:', newData.id);
    return newData;
  } catch (error) {
    console.error('❌ Error saving sensor data:', error);
    throw error;
  }
};

module.exports = {
  getLatestData,
  getHistory,
  saveSensorData
};