import { useState, useEffect, useRef } from 'react';
import { dataAPI } from '../utils/api';

export const useSensorData = (pollingInterval = 3000) => {
  const [sensorData, setSensorData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef();

  const fetchLatestData = async () => {
    try {
      const response = await dataAPI.getLatestData();
      setSensorData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sensor data');
      console.error('Error fetching sensor data:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await dataAPI.getHistory();
      setHistory(response.data.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchLatestData(), fetchHistory()]);
      setLoading(false);
    };

    initializeData();

    // Setup polling
    intervalRef.current = setInterval(fetchLatestData, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollingInterval]);

  const updatePollingInterval = (newInterval) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(fetchLatestData, newInterval);
  };

  return {
    sensorData,
    history,
    loading,
    error,
    refetch: fetchLatestData,
    updatePollingInterval,
  };
};