const mqtt = require('mqtt');
require('dotenv').config();

class MQTTClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  connect() {
    try {
      this.client = mqtt.connect(process.env.MQTT_BROKER_URL);
      
      this.client.on('connect', () => {
        console.log('✅ MQTT Client connected to broker');
        this.isConnected = true;
        this.subscribe('hyyume/sensor/data');
      });

      this.client.on('error', (error) => {
        console.error('❌ MQTT Error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('🔌 MQTT Connection closed');
        this.isConnected = false;
      });

      return this.client;
    } catch (error) {
      console.error('❌ Failed to create MQTT client:', error);
    }
  }

  subscribe(topic) {
    if (this.client && this.isConnected) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`❌ Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`✅ Subscribed to topic: ${topic}`);
        }
      });
    }
  }

  onMessage(callback) {
    if (this.client) {
      this.client.on('message', callback);
    }
  }
}

module.exports = new MQTTClient();