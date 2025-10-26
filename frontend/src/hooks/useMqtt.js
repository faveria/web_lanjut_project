import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'mqtt://148.230.97.142:1883'; // Using the same broker as backend

export const useMqtt = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const clientRef = useRef(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const connect = () => {
      if (clientRef.current && clientRef.current.connected) {
        return;
      }

      console.log(`🔌 Connecting to MQTT broker: ${MQTT_BROKER_URL}`);
      
      const client = mqtt.connect(MQTT_BROKER_URL, {
        clientId: `hyyume_frontend_${Math.random().toString(16).slice(3)}`,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      });

      clientRef.current = client;

      client.on('connect', () => {
        console.log('✅ MQTT Client connected to broker');
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
      });

      client.on('error', (error) => {
        console.error('❌ MQTT Error:', error);
        setIsConnected(false);
        setConnectionError(error.message);
      });

      client.on('close', () => {
        console.log('🔌 MQTT Connection closed');
        setIsConnected(false);
        
        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttempts < maxReconnectAttempts) {
          const newAttempts = reconnectAttempts + 1;
          setReconnectAttempts(newAttempts);
          console.log(`🔄 Attempting to reconnect... (${newAttempts}/${maxReconnectAttempts})`);
          setTimeout(connect, 5000);
        } else {
          console.error('❌ Max reconnection attempts reached');
        }
      });

      client.on('offline', () => {
        console.log('🔴 MQTT Client offline');
        setIsConnected(false);
      });
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.end(true);
      }
    };
  }, [reconnectAttempts]);

  const publish = (topic, message) => {
    if (clientRef.current && isConnected) {
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