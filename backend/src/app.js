const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mqttClient = require('./config/mqtt'); // ✅ Tetap import MQTT client
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'HY.YUME Monitor API is running',
    timestamp: new Date().toISOString(),
    mqttStatus: mqttClient.isConnected ? 'connected' : 'disconnected' // ✅ Info status MQTT
  });
});

// ❌ HAPUS BAGIAN INI (sudah dipindah ke mqtt.js):
// mqttClient.onMessage(async (topic, message) => {
//   try {
//     if (topic === 'hyyume/sensor/data') {
//       const sensorData = JSON.parse(message.toString());
//       console.log('📡 MQTT Data received:', sensorData);
//       
//       await saveSensorData(sensorData);
//       console.log('✅ Data diterima dan disimpan');
//     }
//   } catch (error) {
//     console.error('❌ Error processing MQTT message:', error);
//   }
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
