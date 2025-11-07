import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

// Use WebSocket to connect through the backend's MQTT bridge
// The backend is already configured to handle MQTT connections
const MQTT_BROKER_URL = 'ws://localhost:3000/mqtt'; // Use backend WebSocket endpoint

export const useMqtt = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    console.log(`🔌 Connecting to MQTT broker via WebSocket: ${MQTT_BROKER_URL}`);
    
    try {
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
        console.log('✅ MQTT Client connected via WebSocket');
        setIsConnected(true);
        setConnectionError(null);
      });

      client.on('error', (error) => {
        console.error('❌ MQTT WebSocket Error:', error);
        setConnectionError(error.message || 'Connection error');
      });

      client.on('close', () => {
        console.log('🔌 MQTT WebSocket Connection closed');
        setIsConnected(false);
      });

      client.on('offline', () => {
        console.log('🔴 MQTT WebSocket Client offline');
        setIsConnected(false);
      });

      // Cleanup on unmount
      return () => {
        if (clientRef.current) {
          console.log('🔌 Closing MQTT WebSocket connection on component unmount');
          clientRef.current.end(true);
        }
      };
    } catch (error) {
      console.error('❌ Failed to create MQTT WebSocket client:', error);
      setConnectionError(error.message);
    }
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
      console.warn('⚠️ MQTT WebSocket client not connected, cannot publish message');
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