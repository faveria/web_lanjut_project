const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mqttClient = require('./config/mqtt'); // ✅ Tetap import MQTT client
const mobileBlocker = require('./middlewares/mobileBlocker');
require('dotenv').config();

// ✅ Import dataController after other imports to avoid circular dependency
const dataController = require('./controllers/dataController');

// ✅ CONNECT MQTT CLIENT WITH DATA CONTROLLER to break circular dependency
mqttClient.setMessageHandler(dataController.saveSensorData);

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Custom CORS middleware to handle the specific subdomain scenario
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://hyyyume.my.id',
    'https://www.hyyyume.my.id',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:8081'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mobileBlocker); // Mobile blocking middleware

// Routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'src/public' });
});

// Mobile not supported route
app.get('/mobile-not-supported', (req, res) => {
  res.status(403).sendFile('mobile-not-supported.html', { root: 'src/public' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

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
