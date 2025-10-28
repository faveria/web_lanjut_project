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
      const hourKey = `${date}T${hour.toString().padStart(2, '0')}:00:00.000Z`;
      hourlyData[hourKey] = {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        suhu_air: null,
        suhu_udara: null,
        kelembapan: null,
        tds: null,
        ph: null,
        count: 0
      };
    }
    
    // Group the data by hour and calculate averages
    allData.forEach(record => {
      const recordDate = new Date(record.created_at);
      const hour = recordDate.getUTCHours(); // Use UTC hours
      const hourKey = `${date}T${hour.toString().padStart(2, '0')}:00:00.000Z`;
      
      if (hourlyData[hourKey]) {
        // Accumulate values for averaging
        if (record.suhu_air !== null) {
          hourlyData[hourKey].suhu_air = (hourlyData[hourKey].suhu_air === null ? 0 : hourlyData[hourKey].suhu_air) + record.suhu_air;
          hourlyData[hourKey].count++;
        }
        if (record.suhu_udara !== null) {
          hourlyData[hourKey].suhu_udara = (hourlyData[hourKey].suhu_udara === null ? 0 : hourlyData[hourKey].suhu_udara) + record.suhu_udara;
          hourlyData[hourKey].count++;
        }
        if (record.kelembapan !== null) {
          hourlyData[hourKey].kelembapan = (hourlyData[hourKey].kelembapan === null ? 0 : hourlyData[hourKey].kelembapan) + record.kelembapan;
          hourlyData[hourKey].count++;
        }
        if (record.tds !== null) {
          hourlyData[hourKey].tds = (hourlyData[hourKey].tds === null ? 0 : hourlyData[hourKey].tds) + record.tds;
          hourlyData[hourKey].count++;
        }
        if (record.ph !== null) {
          hourlyData[hourKey].ph = (hourlyData[hourKey].ph === null ? 0 : hourlyData[hourKey].ph) + record.ph;
          hourlyData[hourKey].count++;
        }
      }
    });
    
    // Calculate averages and format the result
    const result = Object.values(hourlyData).map(hourlyRecord => {
      if (hourlyRecord.count > 0) {
        // Calculate averages by dividing accumulated values by count
        // Note: This is a simplified approach - we need to properly track separate counts for each metric
        const averagedRecord = { ...hourlyRecord };
        
        // Calculate average for each field separately
        const countForSuhuAir = allData.filter(r => 
          new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && 
          r.suhu_air !== null
        ).length;
        
        const countForSuhuUdara = allData.filter(r => 
          new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && 
          r.suhu_udara !== null
        ).length;
        
        const countForKelembapan = allData.filter(r => 
          new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && 
          r.kelembapan !== null
        ).length;
        
        const countForTds = allData.filter(r => 
          new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && 
          r.tds !== null
        ).length;
        
        const countForPh = allData.filter(r => 
          new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && 
          r.ph !== null
        ).length;
        
        if (countForSuhuAir > 0) {
          const sum = allData
            .filter(r => new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && r.suhu_air !== null)
            .reduce((sum, r) => sum + r.suhu_air, 0);
          averagedRecord.suhu_air = parseFloat((sum / countForSuhuAir).toFixed(2));
        }
        
        if (countForSuhuUdara > 0) {
          const sum = allData
            .filter(r => new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && r.suhu_udara !== null)
            .reduce((sum, r) => sum + r.suhu_udara, 0);
          averagedRecord.suhu_udara = parseFloat((sum / countForSuhuUdara).toFixed(2));
        }
        
        if (countForKelembapan > 0) {
          const sum = allData
            .filter(r => new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && r.kelembapan !== null)
            .reduce((sum, r) => sum + r.kelembapan, 0);
          averagedRecord.kelembapan = parseFloat((sum / countForKelembapan).toFixed(2));
        }
        
        if (countForTds > 0) {
          const sum = allData
            .filter(r => new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && r.tds !== null)
            .reduce((sum, r) => sum + r.tds, 0);
          averagedRecord.tds = Math.round(sum / countForTds);
        }
        
        if (countForPh > 0) {
          const sum = allData
            .filter(r => new Date(r.created_at).getUTCHours() === new Date(`${date}T${hourlyRecord.hour.slice(0, 2)}:00:00.000Z`).getUTCHours() && r.ph !== null)
            .reduce((sum, r) => sum + r.ph, 0);
          averagedRecord.ph = parseFloat((sum / countForPh).toFixed(2));
        }
        
        return averagedRecord;
      }
      return hourlyRecord;
    });
    
    // Sort by hour
    result.sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0]);
      const hourB = parseInt(b.hour.split(':')[0]);
      return hourA - hourB;
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
  getHourlyData, // Add the new function
  saveSensorData,
  controlPump
};