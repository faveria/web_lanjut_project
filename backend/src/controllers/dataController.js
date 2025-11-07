const { SensorData, User } = require('../models');
const { Op } = require('sequelize'); // Import Op directly from sequelize
const mqttClient = require('../config/mqtt'); // Import MQTT client for pump control
const { generateAlerts } = require('./alertController'); // Import alert generation function

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

// Function to get hourly data for a specific date
const getHourlyData = async (req, res) => {
  try {
    const { date } = req.query; // Date format: YYYY-MM-DD
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required (format: YYYY-MM-DD)'
      });
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    // Create start and end times for the full day (in UTC)
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    
    const allData = await SensorData.findAll({
      where: {
        created_at: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay
        }
      },
      order: [['created_at', 'ASC']]
    });
    
    // Group data by hour and calculate averages
    const hourlyData = {};
    
    // Initialize all 24 hours with null values
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      hourlyData[hourStr] = {
        hour: hourStr,
        suhu_air: null,
        suhu_udara: null,
        kelembapan: null,
        tds: null,
        ph: null,
        record_count: 0  // How many records contributed to this hour
      };
    }
    
    // Group the data by hour and calculate averages
    allData.forEach(record => {
      const recordDate = new Date(record.created_at);
      // Convert to local hour to match the date parameter
      const localHour = recordDate.getUTCHours();
      const hourStr = `${localHour.toString().padStart(2, '0')}:00`;
      
      if (hourlyData[hourStr]) {
        // For each sensor type, accumulate values and count records
        if (record.suhu_air !== null && record.suhu_air !== undefined) {
          if (hourlyData[hourStr].suhu_air === null) {
            hourlyData[hourStr].suhu_air = record.suhu_air;
            hourlyData[hourStr].suhu_air_count = 1;
          } else {
            hourlyData[hourStr].suhu_air = (hourlyData[hourStr].suhu_air + record.suhu_air);
            hourlyData[hourStr].suhu_air_count++;
          }
        }
        
        if (record.suhu_udara !== null && record.suhu_udara !== undefined) {
          if (hourlyData[hourStr].suhu_udara === null) {
            hourlyData[hourStr].suhu_udara = record.suhu_udara;
            hourlyData[hourStr].suhu_udara_count = 1;
          } else {
            hourlyData[hourStr].suhu_udara = (hourlyData[hourStr].suhu_udara + record.suhu_udara);
            hourlyData[hourStr].suhu_udara_count++;
          }
        }
        
        if (record.kelembapan !== null && record.kelembapan !== undefined) {
          if (hourlyData[hourStr].kelembapan === null) {
            hourlyData[hourStr].kelembapan = record.kelembapan;
            hourlyData[hourStr].kelembapan_count = 1;
          } else {
            hourlyData[hourStr].kelembapan = (hourlyData[hourStr].kelembapan + record.kelembapan);
            hourlyData[hourStr].kelembapan_count++;
          }
        }
        
        if (record.tds !== null && record.tds !== undefined) {
          if (hourlyData[hourStr].tds === null) {
            hourlyData[hourStr].tds = record.tds;
            hourlyData[hourStr].tds_count = 1;
          } else {
            hourlyData[hourStr].tds = (hourlyData[hourStr].tds + record.tds);
            hourlyData[hourStr].tds_count++;
          }
        }
        
        if (record.ph !== null && record.ph !== undefined) {
          if (hourlyData[hourStr].ph === null) {
            hourlyData[hourStr].ph = record.ph;
            hourlyData[hourStr].ph_count = 1;
          } else {
            hourlyData[hourStr].ph = (hourlyData[hourStr].ph + record.ph);
            hourlyData[hourStr].ph_count++;
          }
        }
        
        hourlyData[hourStr].record_count++;
      }
    });
    
    // Calculate averages and format the result
    const result = Object.values(hourlyData).map(hourlyRecord => {
      // Calculate averages where data exists
      const finalRecord = { ...hourlyRecord };
      
      // Calculate average for each field if there are values to average
      if (finalRecord.suhu_air_count > 0) {
        finalRecord.suhu_air = parseFloat((finalRecord.suhu_air / finalRecord.suhu_air_count).toFixed(2));
      }
      if (finalRecord.suhu_udara_count > 0) {
        finalRecord.suhu_udara = parseFloat((finalRecord.suhu_udara / finalRecord.suhu_udara_count).toFixed(2));
      }
      if (finalRecord.kelembapan_count > 0) {
        finalRecord.kelembapan = parseFloat((finalRecord.kelembapan / finalRecord.kelembapan_count).toFixed(2));
      }
      if (finalRecord.tds_count > 0) {
        finalRecord.tds = Math.round(finalRecord.tds / finalRecord.tds_count);
      }
      if (finalRecord.ph_count > 0) {
        finalRecord.ph = parseFloat((finalRecord.ph / finalRecord.ph_count).toFixed(2));
      }
      
      // Remove the temporary count fields
      delete finalRecord.suhu_air_count;
      delete finalRecord.suhu_udara_count;
      delete finalRecord.kelembapan_count;
      delete finalRecord.tds_count;
      delete finalRecord.ph_count;
      
      return finalRecord;
    });
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Get hourly data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get daily data summary (for historical page)
const getDailyData = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30; // Default 30 days
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    console.log('📊 Getting daily data for last', days, 'days');

    const history = await SensorData.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      order: [['created_at', 'ASC']],
      limit: 5000
    });

    console.log('📈 Daily data found:', history.length, 'records');

    // Group by day and take one reading per day
    const dailyData = {};
    history.forEach(item => {
      const dayKey = new Date(item.created_at).toISOString().slice(0, 10); // "2025-10-28"
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = item;
      }
    });

    const result = Object.values(dailyData)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    res.json({
      success: true,
      data: result,
      totalRecords: history.length,
      dailyRecords: result.length
    });
  } catch (error) {
    console.error('Get daily data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
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
    
    // Generate alerts for all users based on this sensor data
    try {
      // Get all users to generate alerts for
      const users = await User.findAll({
        attributes: ['id']
      });
      
      // Generate alerts for each user
      for (const user of users) {
        await generateAlerts(newData, user.id);
      }
    } catch (alertError) {
      console.error('❌ Error generating alerts:', alertError);
      // Don't throw the error as it's not critical to saving the sensor data
    }
    
    return newData;
  } catch (error) {
    console.error('❌ Error saving sensor data:', error);
    throw error;
  }
};

module.exports = {
  getLatestData,
  getHistory,
  getHourlyData,
  getDailyData,
  saveSensorData,
  controlPump
};