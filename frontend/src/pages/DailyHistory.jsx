import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Droplets, Thermometer, Droplets as DropletsIcon, Gauge, Activity } from 'lucide-react';

const DailyHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchDailyData = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would call an API to get daily average data
        // For now, we'll use mock data but you can replace this with an actual API call
        
        // Example of what the API call might look like:
        // const response = await dataAPI.getDailyAverage(selectedDate);
        // setDailyData(response.data.data);
        
        // Mock data for demonstration - in a real implementation, replace with actual API call
        const mockData = generateMockDataForDate(selectedDate);
        setDailyData(mockData);
      } catch (error) {
        console.error('Error fetching daily data:', error);
        // Still set mock data for demo purposes
        const mockData = generateMockDataForDate(selectedDate);
        setDailyData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyData();
  }, [selectedDate]);

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
    { dataKey: "suhu_air", title: "Water Temperature Trend", color: "#00A884", icon: DropletsIcon },
    { dataKey: "suhu_udara", title: "Air Temperature Trend", color: "#3B82F6", icon: Thermometer },
    { dataKey: "kelembapan", title: "Humidity Trend", color: "#8B5CF6", icon: Droplets },
    { dataKey: "tds", title: "TDS Trend", color: "#F59E0B", icon: Gauge },
    { dataKey: "ph", title: "pH Level Trend", color: "#EF4444", icon: Activity },
  ];

  const formatDataForChart = (data, dataKey) => {
    return data.map(item => ({
      time: item.hour,
      value: item[dataKey],
    }));
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
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily History</h1>
              <p className="text-gray-600 dark:text-gray-400">Historical trends for your hydroponic system</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <label htmlFor="date-picker" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Select Date:
            </label>
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-primary-200 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartConfig.map((config, index) => {
          const Icon = config.icon;
          return (
            <motion.div
              key={config.dataKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {config.title}
                </h3>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatDataForChart(dailyData, config.dataKey)}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:stroke-gray-600" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      interval="preserveStartEnd"
                      tickMargin={10}
                      stroke="currentColor"
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      width={40}
                      tickMargin={10}
                      stroke="currentColor"
                    />
                    <Tooltip 
                      formatter={(value) => [value, config.title]}
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
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={config.color}
                      strokeWidth={2}
                      dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
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