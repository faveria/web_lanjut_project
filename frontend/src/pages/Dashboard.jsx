import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Droplets } from 'lucide-react';
import SensorCard from '../components/Dashboard/SensorCard';
import ChartBox from '../components/Dashboard/ChartBox';
import StatusAlert from '../components/Dashboard/StatusAlert';
import PumpControl from '../components/Dashboard/PumpControl';
import SummaryCard from '../components/Dashboard/SummaryCard';
import LastUpdatedCard from '../components/Dashboard/LastUpdatedCard';
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
          <button 
            onClick={refetch} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
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
      <SummaryCard
        loading={loading}
        onRefresh={refetch}
      />

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
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        
        <PumpControl
          pumpStatus={sensorData?.pompa}
          onPumpControl={handlePumpControl}
          isControlling={isControlling}
        />
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
        <ChartBox
          title="pH Level Trend"
          dataKey="ph"
          data={history}
          color="#EF4444"
        />
      </div>

      <LastUpdatedCard sensorData={sensorData} />
    </div>
  );
};

export default Dashboard;