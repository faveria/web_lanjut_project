import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Droplets, Thermometer, Droplets as DropletsIcon, Gauge, Activity, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useSensorData } from '../hooks/useWebSocket';

const DailyHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getHourlyData, loading: sensorLoading } = useSensorData();
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the existing API hook to get hourly data for the selected date
        const hourlyData = await getHourlyData(selectedDate);
        setDailyData(hourlyData);
      } catch (error) {
        console.error('Error fetching daily data:', error);
        setError(error.message || 'Failed to load daily data');
        
        // Still generate mock data for demonstration purposes
        const mockData = generateMockDataForDate(selectedDate);
        setDailyData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyData();
  }, [selectedDate]); // Only re-run when selectedDate changes, not when getHourlyData changes

  const generateMockDataForDate = (date) => {
    // Generate mock data for the selected date, simulating hourly averages
    const data = [];
    const dateObj = new Date(date);
    
    for (let hour = 0; hour < 24; hour++) {
      // Generate realistic values with some variation based on time of day
      const baseWaterTemp = 24 + (hour >= 6 && hour <= 18 ? (hour - 6) * 0.2 : -(18 - hour) * 0.15);
      const baseAirTemp = 27 + (hour >= 6 && hour <= 18 ? (hour - 6) * 0.25 : -(18 - hour) * 0.2);
      const baseHumidity = 70 + (hour >= 6 && hour <= 18 ? (18 - hour) * 0.15 : (hour - 6) * 0.1);
      const baseTds = 410 + Math.random() * 10;
      const basePh = 6.8 + (Math.random() - 0.5) * 0.4;
      
      data.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        suhu_air: parseFloat(baseWaterTemp.toFixed(1)),
        suhu_udara: parseFloat(baseAirTemp.toFixed(1)),
        kelembapan: parseFloat(baseHumidity.toFixed(1)),
        tds: Math.round(baseTds),
        ph: parseFloat(basePh.toFixed(1)),
      });
    }
    
    return data;
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    // Update URL without reloading
    navigate(`/daily-history?date=${newDate}`, { replace: true });
  };

  // Chart data for each sensor type
  const chartConfig = [
    { dataKey: "suhu_air", title: "Water Temperature Trend", color: "#00A884", icon: DropletsIcon, label: "Water Temperature (°C)" },
    { dataKey: "suhu_udara", title: "Air Temperature Trend", color: "#3B82F6", icon: Thermometer, label: "Air Temperature (°C)" },
    { dataKey: "kelembapan", title: "Humidity Trend", color: "#8B5CF6", icon: Droplets, label: "Humidity (%)" },
    { dataKey: "tds", title: "TDS Trend", color: "#F59E0B", icon: Gauge, label: "TDS (ppm)" },
    { dataKey: "ph", title: "pH Level Trend", color: "#EF4444", icon: Activity, label: "pH Level" },
  ];

  const formatDataForChart = (data, dataKey) => {
    return data.map(item => ({
      time: item.hour,
      value: item[dataKey],
    }));
  };

  // Calculate statistics for the selected date
  const calculateStats = () => {
    if (!dailyData || dailyData.length === 0) return null;
    
    const stats = {};
    
    ['suhu_air', 'suhu_udara', 'kelembapan', 'tds', 'ph'].forEach(key => {
      const values = dailyData
        .map(item => item[key])
        .filter(v => v !== null && v !== undefined && !isNaN(v));
      
      if (values.length > 0) {
        stats[key] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: parseFloat((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2)),
          count: values.length
        };
      } else {
        stats[key] = { min: null, max: null, avg: null, count: 0 };
      }
    });
    
    return stats;
  };

  const stats = calculateStats();
  
  // Helper to get day of week
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading historical data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily History</h1>
            <p className="text-gray-600 dark:text-gray-400">Historical trends for your hydroponic system</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                const prevDate = new Date(selectedDate);
                prevDate.setDate(prevDate.getDate() - 1);
                const prevDateStr = prevDate.toISOString().split('T')[0];
                setSelectedDate(prevDateStr);
                navigate(`/daily-history?date=${prevDateStr}`, { replace: true });
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Prev
            </button>
            
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Select Date:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-primary-200 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
            
            <button 
              onClick={() => {
                const nextDate = new Date(selectedDate);
                nextDate.setDate(nextDate.getDate() + 1);
                const nextDateStr = nextDate.toISOString().split('T')[0];
                setSelectedDate(nextDateStr);
                navigate(`/daily-history?date=${nextDateStr}`, { replace: true });
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              Next
              <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Date Header with Day of Week */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {getDayOfWeek(selectedDate)} • {dailyData.length} data points recorded
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center text-gray-700 dark:text-gray-300">
            <Clock className="w-5 h-5 mr-2" />
            <span>Updated in real-time</span>
          </div>
        </div>
      </motion.div>

      {/* Statistics Summary */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
            <div className="flex items-center">
              <DropletsIcon className="w-6 h-6 text-blue-500 mr-2" />
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.suhu_air?.avg != null ? `${stats.suhu_air.avg}°` : 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Water Avg</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {stats.suhu_air?.min != null && stats.suhu_air?.max != null 
                    ? `${stats.suhu_air.min}° - ${stats.suhu_air.max}°` 
                    : 'No data'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
            <div className="flex items-center">
              <Thermometer className="w-6 h-6 text-red-500 mr-2" />
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.suhu_udara?.avg != null ? `${stats.suhu_udara.avg}°` : 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Air Avg</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {stats.suhu_udara?.min != null && stats.suhu_udara?.max != null 
                    ? `${stats.suhu_udara.min}° - ${stats.suhu_udara.max}°` 
                    : 'No data'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
            <div className="flex items-center">
              <Droplets className="w-6 h-6 text-green-500 mr-2" />
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.kelembapan?.avg != null ? `${stats.kelembapan.avg}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Humidity Avg</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {stats.kelembapan?.min != null && stats.kelembapan?.max != null 
                    ? `${stats.kelembapan.min}% - ${stats.kelembapan.max}%` 
                    : 'No data'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
            <div className="flex items-center">
              <Gauge className="w-6 h-6 text-yellow-500 mr-2" />
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.tds?.avg != null ? stats.tds.avg : 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">TDS Avg</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {stats.tds?.min != null && stats.tds?.max != null 
                    ? `${stats.tds.min} - ${stats.tds.max}` 
                    : 'No data'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
            <div className="flex items-center">
              <Activity className="w-6 h-6 text-purple-500 mr-2" />
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.ph?.avg != null ? stats.ph.avg : 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">pH Avg</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {stats.ph?.min != null && stats.ph?.max != null 
                    ? `${stats.ph.min} - ${stats.ph.max}` 
                    : 'No data'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center"
        >
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 dark:text-red-300">Error loading data: {error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartConfig.map((config, index) => {
          const Icon = config.icon;
          const chartData = formatDataForChart(dailyData, config.dataKey);
          
          return (
            <motion.div
              key={config.dataKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                  config.dataKey === 'suhu_air' ? 'bg-blue-100 dark:bg-blue-900/50' :
                  config.dataKey === 'suhu_udara' ? 'bg-red-100 dark:bg-red-900/50' :
                  config.dataKey === 'kelembapan' ? 'bg-green-100 dark:bg-green-900/50' :
                  config.dataKey === 'tds' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                  config.dataKey === 'ph' ? 'bg-purple-100 dark:bg-purple-900/50' : 
                  'bg-primary-100 dark:bg-primary-900/50'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    config.dataKey === 'suhu_air' ? 'text-blue-600 dark:text-blue-400' :
                    config.dataKey === 'suhu_udara' ? 'text-red-600 dark:text-red-400' :
                    config.dataKey === 'kelembapan' ? 'text-green-600 dark:text-green-400' :
                    config.dataKey === 'tds' ? 'text-yellow-600 dark:text-yellow-400' :
                    config.dataKey === 'ph' ? 'text-purple-600 dark:text-purple-400' : 
                    'text-primary-600 dark:text-primary-400'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {config.title}
                </h3>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:stroke-gray-600" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      interval={2} // Show every 2nd hour to reduce clutter
                      tickMargin={10}
                      stroke="currentColor"
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      width={40}
                      tickMargin={10}
                      stroke="currentColor"
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}`, config.label]}
                      labelFormatter={(label) => `Time: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'inherit',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name={config.label}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={{ fill: config.color, strokeWidth: 2, r: 2 }}
                      activeDot={{ r: 6, fill: config.color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyHistory;