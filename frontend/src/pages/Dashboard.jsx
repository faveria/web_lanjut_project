import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import SensorCard from '../components/Dashboard/SensorCard';
import ChartBox from '../components/Dashboard/ChartBox';
import StatusAlert from '../components/Dashboard/StatusAlert';
import PumpControl from '../components/Dashboard/PumpControl';
import { useSensorData } from '../hooks/useWebSocket';
import { usePumpControl } from '../hooks/usePumpControl';

const Dashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const { sensorData, history, loading, error, refetch } = useSensorData();
  const { controlPump: controlPumpAPI, isControlling, error: pumpError } = usePumpControl();

  const sensorTypes = ['suhu_air', 'suhu_udara', 'kelembapan', 'tds', 'ph'];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={refetch} className="bg-primary-500 hover:bg-primary-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handlePumpControl = async (status) => {
    if (isControlling) return;
    
    try {
      await controlPumpAPI(status);
      // The pump status will be updated automatically when the sensor data refreshes
    } catch (err) {
      console.error('Failed to control pump:', err);
      // Error is handled in the hook, but we can show additional UI feedback if needed
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 mt-1 dark:text-gray-300">Real-time hydroponic system monitoring</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={refetch} 
            variant="outline" 
            className="flex items-center space-x-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </motion.div>

      {/* Status Alert */}
      {showAlert && sensorData && (
        <StatusAlert 
          sensorData={sensorData} 
          onClose={() => setShowAlert(false)} 
        />
      )}

      {/* Sensor Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {sensorTypes.map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SensorCard
              type={type}
              value={sensorData?.[type]}
              loading={loading}
            />
          </motion.div>
        ))}
        {/* Pump Status Card */}
        <motion.div
          key="pompa"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sensorTypes.length * 0.1 }}
        >
          <Card className="h-full transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Pump Status
                </CardTitle>
                <div className={`w-6 h-6 rounded-full ${sensorData?.pompa === 'ON' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {sensorData?.pompa || '--'}
                  </span>
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full w-fit ${sensorData?.pompa === 'ON' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {sensorData?.pompa === 'ON' ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Grid and Pump Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox
          title="Water Temperature Trend"
          dataKey="suhu_air"
          data={history}
          color="#00A884"
        />
        <ChartBox
          title="Air Temperature Trend"
          dataKey="suhu_udara"
          data={history}
          color="#3B82F6"
        />
        <ChartBox
          title="Humidity Trend"
          dataKey="kelembapan"
          data={history}
          color="#8B5CF6"
        />
        <ChartBox
          title="TDS Trend"
          dataKey="tds"
          data={history}
          color="#F59E0B"
        />
        <ChartBox
          title="pH Level Trend"
          dataKey="ph"
          data={history}
          color="#EF4444"
        />
        <PumpControl 
          pumpStatus={sensorData?.pompa} 
          onPumpControl={handlePumpControl} 
        />
      </div>

      {/* Last Updated */}
      {sensorData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500"
        >
          Last updated: {new Date(sensorData.created_at).toLocaleString()}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;