import { useState, useEffect, useRef } from 'react';
import { dataAPI } from '../utils/api';

export const useSensorData = (pollingInterval = 3000) => {
  const [sensorData, setSensorData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef();
  const hourlyDataRef = useRef([]);
  const hourlyIntervalRef = useRef();

  const fetchLatestData = async () => {
    try {
      const response = await dataAPI.getLatestData();
      setSensorData(response.data.data);
      setError(null);
      
      // Record hourly data when we get new sensor data
      recordHourlyData(response.data.data);
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

  // Function to record data hourly
  const recordHourlyData = (currentSensorData) => {
    if (!currentSensorData) return;
    
    const currentTime = new Date();
    // Create timestamp rounded to the hour (e.g., "2023-01-01T10:00:00.000Z")
    const currentHour = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      currentTime.getHours(),
      0,
      0,
      0
    ).toISOString();

    // Create new hourly record
    const newHourlyRecord = {
      ...currentSensorData,
      created_at: currentHour
    };

    // Check if we already have data for this exact hour (same date and hour)
    const existingIndex = hourlyDataRef.current.findIndex(
      (record) => record.created_at === currentHour
    );

    if (existingIndex === -1) {
      // Add new record
      const updatedData = [...hourlyDataRef.current, newHourlyRecord];
      
      // Keep only the last 24 hours of data to prevent memory issues
      if (updatedData.length > 24) {
        hourlyDataRef.current = updatedData.slice(-24);
      } else {
        hourlyDataRef.current = updatedData;
      }
    }
  };

  // Method to get hourly data for a specific date
  const getHourlyData = async (date) => {
    try {
      const response = await dataAPI.getHourlyData(date);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching hourly data:', error);
      throw error;
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
      if (hourlyIntervalRef.current) {
        clearInterval(hourlyIntervalRef.current);
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
    getHourlyData, // Add method to get hourly data
  };
};
