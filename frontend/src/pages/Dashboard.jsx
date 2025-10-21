import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Droplets } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import SensorCard from '../components/Dashboard/SensorCard';
import ChartBox from '../components/Dashboard/ChartBox';
import StatusAlert from '../components/Dashboard/StatusAlert';
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
        
        {/* Pump Status & Control Card */}
        <motion.div
          key="pompa"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="h-full transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-0 md:pb-1 lg:pb-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md mb-2 md:text-lg lg:text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Pump Control
                </CardTitle>
                <div className={`w-2 h-2 md:w-6 md:h-6 lg:w-6 lg:h-6 rounded-full ${sensorData?.pompa === 'ON' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Display */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {sensorData?.pompa || '--'}
                    </span>
                    {/* Status Label - selalu di bawah teks */}
                    <div className={`hidden sm:hidden md:block text-sm font-medium px-2 py-1 rounded-full mt-1 ${sensorData?.pompa === 'ON' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {sensorData?.pompa === 'ON' ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  {/* Toggle untuk desktop */}
                  <div className="hidden sm:flex flex-col items-center space-y-3 pt-2">
                    <div 
                      onClick={() => handlePumpControl(sensorData?.pompa === 'ON' ? 'OFF' : 'ON')}
                      className={`relative inline-flex items-center h-7 rounded-full w-16 cursor-pointer transition-all duration-300 ${
                        sensorData?.pompa === 'ON' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      } ${isControlling ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <span 
                        className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg transition-all duration-300 ${
                          sensorData?.pompa === 'ON' ? 'translate-x-8' : 'translate-x-1'
                        } ${isControlling ? 'animate-pulse' : ''}`}
                      />
                    </div>


                    {/* Loading Indicator */}
                    {isControlling && (
                      <div className="mt-1 w-full text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-center">
                        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-0.5"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggle untuk mobile (di bawah teks) */}
                <div className="sm:hidden flex flex-col items-center space-y-3">
                  <div 
                    onClick={() => handlePumpControl(sensorData?.pompa === 'ON' ? 'OFF' : 'ON')}
                    className={`relative inline-flex items-center h-7 rounded-full w-16 cursor-pointer transition-all duration-300 ${
                      sensorData?.pompa === 'ON' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    } ${isControlling ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span 
                      className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg transition-all duration-300 ${
                        sensorData?.pompa === 'ON' ? 'translate-x-8' : 'translate-x-1'
                      } ${isControlling ? 'animate-pulse' : ''}`}
                    />
                  </div>

                  {/* Loading Indicator */}
                  {isControlling && (
                    <div className="w-full text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-center">
                      <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin mr-0.5"></div>
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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