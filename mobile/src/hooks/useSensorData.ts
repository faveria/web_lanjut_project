import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState } from 'react-native';
import { dataAPI } from '../api/client';

type SensorData = Record<string, any> | null;

export function useSensorData(pollingMs = 1000) {
  const [sensorData, setSensorData] = useState<SensorData>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLatestData = async () => {
    try {
      const res = await dataAPI.getLatestData();
      setSensorData(res.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sensor data');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await dataAPI.getHistory();
      setHistory(res.data.data);
    } catch (err) {
      // noop
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchLatestData(), fetchHistory()]);
      setLoading(false);
    })();

    const startPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchLatestData, pollingMs);
    };
    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startPolling();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        fetchLatestData();
        startPolling();
      } else {
        stopPolling();
      }
    });

    return () => {
      stopPolling();
      sub.remove();
    };
  }, [pollingMs]);

  const getHourlyData = useCallback(async (date: string) => {
    try {
      const res = await dataAPI.getHourlyData(date);
      return res.data.data;
    } catch (err) {
      console.error('Error fetching hourly data:', err);
      throw err;
    }
  }, []);

  return { sensorData, history, loading, error, refetch: fetchLatestData, getHourlyData };
}


