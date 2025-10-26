import { useState } from 'react';
import { useMqtt } from './useMqtt';

export const usePumpControl = () => {
  const [isControlling, setIsControlling] = useState(false);
  const [error, setError] = useState(null);
  const { isConnected, publish } = useMqtt();

  const controlPump = async (status) => {
    setIsControlling(true);
    setError(null);
    
    try {
      if (!isConnected) {
        throw new Error('MQTT client not connected');
      }

      // Publish MQTT message to control pump
      await publish('hyyume/sensor/pump', status);
      console.log('Pump control MQTT message sent:', status);
      
      return { success: true, message: `Pump command sent: ${status}` };
    } catch (err) {
      console.error('Error controlling pump:', err);
      setError(err.message || 'Failed to control pump');
      throw err;
    } finally {
      setIsControlling(false);
    }
  };

  return {
    controlPump,
    isControlling,
    error,
    mqttConnected: isConnected
  };
};