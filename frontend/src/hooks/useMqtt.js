import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

// Use the same broker that works with mosquitto_pub
const MQTT_BROKER_URL = 'mqtt://148.230.97.142:1883';

export const useMqtt = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    console.log(`🔌 Connecting to MQTT broker: ${MQTT_BROKER_URL}`);
    
    const client = mqtt.connect(MQTT_BROKER_URL, {
      clientId: `hyyume_frontend_${Math.random().toString(16).slice(3)}`,
      clean: true,
      connectTimeout: 10000,
      reconnectPeriod: 1000,
      // Additional options
      keepalive: 60,
      resubscribe: true,
    });

    clientRef.current = client;

    client.on('connect', () => {
      console.log('✅ MQTT Client connected to broker');
      setIsConnected(true);
      setConnectionError(null);
    });

    client.on('error', (error) => {
      console.error('❌ MQTT Error:', error);
      setConnectionError(error.message || 'Connection error');
    });

    client.on('close', () => {
      console.log('🔌 MQTT Connection closed');
      setIsConnected(false);
    });

    client.on('offline', () => {
      console.log('🔴 MQTT Client offline');
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        console.log('🔌 Closing MQTT connection on component unmount');
        clientRef.current.end(true);
      }
    };
  }, []);

  const publish = (topic, message) => {
    if (clientRef.current && isConnected) {
      console.log(`📤 Publishing message: ${message} to topic: ${topic}`);
      return new Promise((resolve, reject) => {
        clientRef.current.publish(topic, String(message), { qos: 0 }, (err) => {
          if (err) {
            console.error('❌ MQTT Publish error:', err);
            reject(err);
          } else {
            console.log(`✅ MQTT message published: ${message} to topic: ${topic}`);
            resolve();
          }
        });
      });
    } else {
      console.warn('⚠️ MQTT client not connected, cannot publish message');
      return Promise.reject(new Error('MQTT client not connected'));
    }
  };

  const subscribe = (topic) => {
    if (clientRef.current && isConnected) {
      return new Promise((resolve, reject) => {
        clientRef.current.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.error(`❌ Failed to subscribe to ${topic}:`, err);
            reject(err);
          } else {
            console.log(`✅ Subscribed to topic: ${topic}`);
            resolve();
          }
        });
      });
    } else {
      return Promise.reject(new Error('MQTT client not connected'));
    }
  };

  return {
    isConnected,
    connectionError,
    publish,
    subscribe,
  };
};