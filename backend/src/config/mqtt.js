const mqtt = require('mqtt');
require('dotenv').config();
const { saveSensorData } = require('../controllers/dataController'); // ✅ BARU

class MQTTClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;           // ✅ BARU
    this.maxReconnectAttempts = 5;        // ✅ BARU
  }

  connect() {
    try {
      console.log(`🔌 Connecting to MQTT broker: ${process.env.MQTT_BROKER_URL}`); // ✅ BARU
      
      this.client = mqtt.connect(process.env.MQTT_BROKER_URL, {
        clientId: `hyyume_backend_${Math.random().toString(16).slice(3)}`, // ✅ BARU
        clean: true,                    // ✅ BARU
        connectTimeout: 4000,           // ✅ BARU
        reconnectPeriod: 1000,          // ✅ BARU
      });
      
      this.client.on('connect', () => {
        console.log('✅ MQTT Client connected to broker');
        this.isConnected = true;
        this.reconnectAttempts = 0;     // ✅ BARU
        this.subscribe('hyyume/sensor/data');
      });

      // ✅ BARU: Message handler langsung di sini (tidak perlu onMessage callback)
      this.client.on('message', async (topic, message) => {
        try {
          console.log(`📨 MQTT Message received on topic: ${topic}`); // ✅ BARU
          const data = JSON.parse(message.toString());
          console.log('📊 Sensor Data:', data); // ✅ BARU
          
          // Save to database
          await saveSensorData(data);
          console.log('💾 Data saved to database successfully'); // ✅ BARU
        } catch (error) {
          console.error('❌ Error processing MQTT message:', error);
          console.error('Raw message:', message.toString()); // ✅ BARU
        }
      });

      this.client.on('error', (error) => {
        console.error('❌ MQTT Error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('🔌 MQTT Connection closed');
        this.isConnected = false;
        this.handleReconnect(); // ✅ BARU
      });

      // ✅ BARU: Event handler untuk offline
      this.client.on('offline', () => {
        console.log('🔴 MQTT Client offline');
        this.isConnected = false;
      });

      return this.client;
    } catch (error) {
      console.error('❌ Failed to create MQTT client:', error);
    }
  }

  // ✅ BARU: Function untuk handle reconnect otomatis
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), 5000);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  subscribe(topic) {
    if (this.client && this.isConnected) {
      this.client.subscribe(topic, { qos: 0 }, (err) => { // ✅ BARU: tambah qos
        if (err) {
          console.error(`❌ Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`✅ Subscribed to topic: ${topic}`);
        }
      });
    } else {
      console.log('⚠️  MQTT client not connected, cannot subscribe'); // ✅ BARU
    }
  }

  // ❌ DIHAPUS: onMessage callback (karena sudah langsung handle di constructor)
}

module.exports = new MQTTClient();
