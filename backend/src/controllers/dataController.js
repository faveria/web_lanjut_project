const { SensorData } = require('../models');
const { Op } = require('sequelize'); // Import Op directly from sequelize
const mqttClient = require('../config/mqtt'); // Import MQTT client for pump control

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

// Control pump via MQTT
const controlPump = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['ON', 'OFF'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "ON" or "OFF"'
      });
    }

    // DEBUG: Log both connection states
    console.log('🔌 MQTT Status:', {
      classProperty: mqttClient.isConnected,        // Your class property (might be stale)
      realTimeState: mqttClient.client?.connected   // MQTT library's real-time state
    });

    // FIX: Use the REAL-TIME connection state from MQTT library
    if (mqttClient.client && mqttClient.client.connected) {
      const topic = 'hyyume/sensor/pump';
      
      // Use callback to properly handle publish errors
      mqttClient.client.publish(topic, status, (err) => {
        if (err) {
          console.error('❌ MQTT Publish failed:', err);
          return res.status(503).json({
            success: false,
            message: 'Failed to send command to pump'
          });
        }
        
        console.log(`✅ Pump command sent: ${status} to topic: ${topic}`);
        res.json({
          success: true,
          message: `Pump command sent: ${status}`
        });
      });
    } else {
      console.error('❌ MQTT client not connected');
      res.status(503).json({
        success: false,
        message: 'MQTT client not connected'
      });
    }
  } catch (error) {
    console.error('💥 Control pump error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getHistory = async (req, res) => {
  try {
    // Get the MOST RECENT data regardless of time range (since we have old data)
    const history = await SensorData.findAll({
      order: [['created_at', 'DESC']],  // Newest first to get most recent data
      limit: 1000
    });

    console.log('📊 Most recent data:', history.length, 'records');
    if (history.length > 0) {
      console.log('⏰ Most recent timestamp:', history[0].created_at);
      console.log('⏰ Oldest timestamp in result:', history[history.length-1].created_at);
    }
    
    // Reverse to show oldest first for charts
    res.json({
      success: true,
      data: history.reverse()
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
    const { suhu_air, suhu_udara, kelembapan, tds, ph, pompa } = sensorData;
    
    const newData = await SensorData.create({
      suhu_air,
      suhu_udara,
      kelembapan,
      tds,
      ph: ph || null,
      pompa: pompa || null,
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
  saveSensorData,
  controlPump
};