import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import SensorCard from '../components/Dashboard/SensorCard';
import ChartBox from '../components/Dashboard/ChartBox';
import StatusAlert from '../components/Dashboard/StatusAlert';
import { useSensorData } from '../hooks/useWebSocket';

const Dashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const { sensorData, history, loading, error, refetch } = useSensorData();

  const sensorTypes = ['suhu_air', 'suhu_udara', 'kelembapan', 'tds'];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time hydroponic system monitoring</p>
        </div>
        <Button 
          onClick={refetch} 
          variant="outline" 
          className="flex items-center space-x-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
      </motion.div>

      {/* Charts Grid */}
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