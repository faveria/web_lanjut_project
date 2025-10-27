import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Droplets, Activity, TrendingUp, Droplets as DropletsIcon, Thermometer, Gauge, Monitor, Clock } from 'lucide-react';
import SensorCard from '../components/Dashboard/SensorCard';
import ChartBox from '../components/Dashboard/ChartBox';
import StatusAlert from '../components/Dashboard/StatusAlert';
import PumpControl from '../components/Dashboard/PumpControl';
import SummaryCard from '../components/Dashboard/SummaryCard';
import LastUpdatedCard from '../components/Dashboard/LastUpdatedCard';
import { useSensorData } from '../hooks/useWebSocket';
import { usePumpControl } from '../hooks/usePumpControl';

// Interactive dashboard visualization component
const InteractiveDashboard = () => {
  const [sensorData, setSensorData] = useState({
    ph: 6.8,
    temp: 24.5,
    tds: 560,
    humidity: 65,
    light: 12
  });

  // Simulate real-time sensor updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ph: Math.max(4, Math.min(9, prev.ph + (Math.random() - 0.5) * 0.1)),
        temp: Math.max(15, Math.min(35, prev.temp + (Math.random() - 0.5) * 0.2)),
        tds: Math.max(400, Math.min(800, prev.tds + (Math.random() - 0.5) * 10)),
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5))),
        light: Math.max(0, Math.min(24, prev.light + (Math.random() - 0.5) * 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary-100/30 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Real-time Sensor Dashboard</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Live</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
          <div className="flex items-center">
            <DropletsIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{sensorData.ph.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">pH Level</div>
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${((sensorData.ph - 4) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
          <div className="flex items-center">
            <Thermometer className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{sensorData.temp.toFixed(1)}°C</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Water Temp</div>
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${((sensorData.temp - 15) / 20) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
          <div className="flex items-center">
            <Gauge className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{sensorData.tds}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">TDS Level</div>
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(sensorData.tds / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Live chart visualization */}
      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-2">
        <div className="h-full flex items-end justify-between space-x-0.5">
          {Array.from({ length: 24 }, (_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-primary-500 to-blue-500 w-full rounded-t"
              style={{ height: `${Math.random() * 80 + 20}%` }}
              initial={{ height: Math.random() * 30 + 10 }}
              animate={{ height: `${Math.random() * 80 + 20}%` }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const { sensorData, history, loading, error, refetch, getHourlyData } = useSensorData();
  const { controlPump: controlPumpAPI, isControlling, error: pumpError } = usePumpControl();

  const sensorTypes = ['suhu_air', 'suhu_udara', 'kelembapan', 'tds', 'ph'];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={refetch} 
            className="bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatusAlert 
            sensorData={sensorData} 
            onClose={() => setShowAlert(false)} 
          />
        </motion.div>
      )}



      {/* Sensor Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sensorTypes.map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <SensorCard
              type={type}
              value={sensorData?.[type]}
              loading={loading}
            />
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <PumpControl
            pumpStatus={sensorData?.pompa}
            onPumpControl={handlePumpControl}
            isControlling={isControlling}
          />
        </motion.div>
      </motion.div>

      {/* Charts Grid - showing last 10 hours of data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
      >
        <div className="flex items-center mb-4">
          <Activity className="w-5 h-5 text-primary-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Last 10 Hours Trend</h2>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {history ? `Showing data from the last 10 hours (${history.length} data points total)` : 'Loading data...'}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: "Water Temperature Trend", dataKey: "suhu_air", color: "#00A884" },
            { title: "Air Temperature Trend", dataKey: "suhu_udara", color: "#3B82F6" },
            { title: "Humidity Trend", dataKey: "kelembapan", color: "#8B5CF6" },
            { title: "TDS Trend", dataKey: "tds", color: "#F59E0B" },
            { title: "pH Level Trend", dataKey: "ph", color: "#EF4444" }
          ].map((chart, index) => {
            // Filter history to last 10 hours for each chart with robust date handling
            let filteredData = [];
            if (history && history.length > 0) {
              // More reliable time calculation
              const tenHoursAgo = new Date(Date.now() - (10 * 60 * 60 * 1000)); // 10 hours ago from now
              
              console.log('⏰ Filtering data from:', tenHoursAgo);
              console.log('📊 Total history points:', history.length);
              console.log('📅 History time range:', history[0]?.created_at, 'to', history[history.length-1]?.created_at);

              filteredData = history.filter(item => {
                try {
                  if (!item?.created_at) return false;
                  
                  const itemDate = new Date(item.created_at);
                  if (isNaN(itemDate.getTime())) return false;
                  
                  const isWithinRange = itemDate >= tenHoursAgo;
                  return isWithinRange;
                } catch (error) {
                  console.warn('Error parsing date:', error);
                  return false;
                }
              });
              
              console.log('✅ Filtered data points:', filteredData.length);
              
              // Sort by time to ensure proper chart display (oldest first)
              filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
              
              // If we have too many points, sample them for better chart performance
              if (filteredData.length > 100) {
                const sampleRate = Math.ceil(filteredData.length / 100);
                filteredData = filteredData.filter((_, index) => index % sampleRate === 0);
                console.log('📈 Sampled to:', filteredData.length, 'points');
              }
              
              // Add fallback: if no data in last 10 hours, show last 50 points
              if (filteredData.length === 0) {
                filteredData = [...history].slice(-50);
                console.log('🔄 Using fallback data:', filteredData.length, 'points');
              }
            }
            
            return (
              <motion.div
                key={chart.dataKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="w-full"
              >
                <ChartBox
                  title={chart.title}
                  dataKey={chart.dataKey}
                  data={filteredData}
                  color={chart.color}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <LastUpdatedCard sensorData={sensorData} />
      </motion.div>
    </div>
  );
};

export default Dashboard;