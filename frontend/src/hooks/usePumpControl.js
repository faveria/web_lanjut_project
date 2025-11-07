import { useState } from 'react';
import { pumpAPI } from '../utils/api';

export const usePumpControl = () => {
  const [isControlling, setIsControlling] = useState(false);
  const [error, setError] = useState(null);

  const controlPump = async (status) => {
    setIsControlling(true);
    setError(null);
    
    
    try {
      // Use the existing HTTP API that routes to MQTT on the backend
      const response = await pumpAPI.controlPump(status);
      console.log('Pump control request sent via HTTP (backend routes to MQTT):', status);
      return response.data;
    } catch (err) {
      console.error('Error controlling pump:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsControlling(false);
    }
  };

  return {
    controlPump,
    isControlling,
    error
  };
};