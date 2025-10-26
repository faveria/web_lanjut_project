import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

// Try WebSocket endpoint that should work in browser
// If the main endpoint doesn't work, try other common ports
const MQTT_BROKER_URLS = [
  'wss://hyyyume.my.id:8084/mqtt',  // Standard WebSockets MQTT
  'wss://hyyyume.my.id:8884',       // Alternative WebSocket port
  'ws://148.230.97.142:9001',       // Direct IP WebSocket
  'ws://148.230.97.142:8084'        // Direct IP WebSocket alternative
];

let currentBrokerIndex = 0;
const MQTT_BROKER_URL = MQTT_BROKER_URLS[currentBrokerIndex];

export const useMqtt = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const clientRef = useRef(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const connect = () => {
      if (clientRef.current && clientRef.current.connected) {
        console.log('✅ Already connected, skipping connection attempt');
        return;
      }

      const brokerUrl = MQTT_BROKER_URLS[currentBrokerIndex];
      console.log(`🔌 Connecting to MQTT broker: ${brokerUrl}`);
      
      try {
        const client = mqtt.connect(brokerUrl, {
          clientId: `hyyume_frontend_${Math.random().toString(16).slice(3)}`,
          clean: true,
          connectTimeout: 10000, // Increased timeout
          reconnectPeriod: 1000,
          // Additional options that might help
          keepalive: 60,
          resubscribe: true,
          // Add protocol options if needed
          protocolId: 'MQTT',
          protocolVersion: 4,
          // Enable more debugging
          reconnectPeriod: 3000, // Try reconnection more frequently
          connectTimeout: 10000,
        });

        clientRef.current = client;

        client.on('connect', (connack) => {
          console.log('✅ MQTT Client connected to broker:', brokerUrl, 'Connack:', connack);
          setIsConnected(true);
          setConnectionError(null);
          setReconnectAttempts(0);
        });

        client.on('error', (error) => {
          console.error('❌ MQTT Error:', error);
          console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
          setIsConnected(false);
          setConnectionError(error.message || 'Connection error');
        });

        client.on('close', () => {
          console.log('🔌 MQTT Connection closed');
          setIsConnected(false);
          
          // Attempt to reconnect to next broker if we haven't exceeded max attempts
          if (reconnectAttempts < maxReconnectAttempts) {
            const newAttempts = reconnectAttempts + 1;
            currentBrokerIndex = (currentBrokerIndex + 1) % MQTT_BROKER_URLS.length;
            setReconnectAttempts(newAttempts);
            console.log(`🔄 Attempting to reconnect to next broker... (${newAttempts}/${maxReconnectAttempts})`);
            setTimeout(connect, 3000); // Shorter delay to try next broker quickly
          } else {
            console.error('❌ Max reconnection attempts reached');
          }
        });

        client.on('offline', () => {
          console.log('🔴 MQTT Client offline');
          setIsConnected(false);
        });
        
        // Additional event for debugging
        client.on('packetsend', (packet) => {
          console.log('📤 Packet sent:', packet.cmd);
        });
        
        client.on('packetreceive', (packet) => {
          console.log('📥 Packet received:', packet.cmd);
        });
      } catch (error) {
        console.error('❌ Failed to create MQTT client:', error);
        setConnectionError(error.message);
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        console.log('🔌 Closing MQTT connection on component unmount');
        clientRef.current.end(true);
      }
    };
  }, [reconnectAttempts]);

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