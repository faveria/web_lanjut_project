const app = require('./app');
const { syncDatabase } = require('./models');
const mqttClient = require('./config/mqtt');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Sync database
    await syncDatabase();
    console.log('✅ Database synchronized'); // ✅ BARU
    
    // Start MQTT client
    console.log('🚀 Starting MQTT client...'); // ✅ BARU
    mqttClient.connect();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 HY.YUME Monitor Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 MQTT Broker: ${process.env.MQTT_BROKER_URL}`);
      console.log(`📡 Subscribed to: hyyume/sensor/data`); // ✅ BARU
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
