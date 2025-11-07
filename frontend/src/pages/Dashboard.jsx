import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Droplets, Activity, TrendingUp, Droplets as DropletsIcon, Thermometer, Gauge, Monitor, Clock, Leaf } from 'lucide-react';
import SensorCard from '../components/Dashboard/SensorCard';
import ChartBox from '../components/Dashboard/ChartBox';
import StatusAlert from '../components/Dashboard/StatusAlert';
import PumpControl from '../components/Dashboard/PumpControl';
import SummaryCard from '../components/Dashboard/SummaryCard';
import LastUpdatedCard from '../components/Dashboard/LastUpdatedCard';
import PlantHealthDashboard from '../components/Dashboard/PlantHealthDashboard';
import { useSensorData } from '../hooks/useWebSocket';
import { usePumpControl } from '../hooks/usePumpControl';
import { useAuth } from '../context/AuthContext';

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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'plant-health'
  const { sensorData, history, loading, error, refetch, getHourlyData } = useSensorData();
  const { controlPump: controlPumpAPI, isControlling, error: pumpError } = usePumpControl();
  const { user } = useAuth();

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

      {/* Tab Navigation for Plant Features */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'overview'
              ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <div className="flex items-center">
            <DropletsIcon className="w-4 h-4 mr-2" />
            System Overview
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'plant-health'
              ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50 dark:bg-green-900/20'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('plant-health')}
        >
          <div className="flex items-center">
            <Leaf className="w-4 h-4 mr-2" />
            Plant Health
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status Alert - Only show system alerts when in overview mode */}
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
                // Show exactly 1 data point for each of the last 10 hours
                let filteredData = [];
                if (history && history.length > 0) {
                  console.log('📊 Total history points:', history.length);
                  console.log('📅 History time range:', history[0]?.created_at, 'to', history[history.length-1]?.created_at);

                  // Create array for the last 10 hours
                  const lastTenHours = [];
                  const now = new Date();
                  
                  // Generate the last 10 hour slots
                  for (let i = 0; i < 10; i++) {
                    const hour = new Date(now);
                    hour.setHours(hour.getHours() - i);
                    hour.setMinutes(0, 0, 0); // Set to beginning of hour
                    
                    const hourKey = hour.toISOString().slice(0, 13); // "2025-10-27T10"
                    lastTenHours.unshift({ hourKey, targetTime: new Date(hour) }); // Oldest first
                  }

                  console.log('⏰ Looking for data in hours:', lastTenHours.map(h => h.hourKey));

                  // Find the closest data point for each hour
                  filteredData = lastTenHours.map(hourSlot => {
                    // Find all data points in this hour
                    const dataInThisHour = history.filter(item => {
                      const itemDate = new Date(item.created_at);
                      const itemHourKey = itemDate.toISOString().slice(0, 13);
                      return itemHourKey === hourSlot.hourKey;
                    });

                    if (dataInThisHour.length > 0) {
                      // Take the data point closest to the middle of the hour
                      const targetTime = hourSlot.targetTime.getTime() + (30 * 60 * 1000); // Middle of hour
                      const closest = dataInThisHour.reduce((closest, current) => {
                        const currentDiff = Math.abs(new Date(current.created_at).getTime() - targetTime);
                        const closestDiff = Math.abs(new Date(closest.created_at).getTime() - targetTime);
                        return currentDiff < closestDiff ? current : closest;
                      });
                      return closest;
                    }
                    
                    // If no data for this hour, return null (will be filtered out)
                    return null;
                  }).filter(item => item !== null); // Remove hours with no data

                  console.log('📈 Hourly data points found:', filteredData.length, 'out of 10 hours');
                  
                  // If we have very few points, show what we have
                  if (filteredData.length === 0) {
                    // Fallback: show last 10 data points
                    filteredData = history.slice(-10);
                    console.log('🔄 Using fallback - last 10 data points');
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
      )}

      {activeTab === 'plant-health' && (
        <PlantHealthDashboard 
          userId={user?.id} 
          sensorData={sensorData} 
        />
      )}
    </div>
  );
};

export default Dashboard;