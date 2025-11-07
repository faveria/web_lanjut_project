import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Thermometer, Gauge, Activity, Wind } from 'lucide-react';

const ChartBox = ({ data, title, dataKey, color = '#00A884' }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const chartData = data?.map(item => ({
    time: formatTime(item.created_at),
    value: item[dataKey],
    fullTime: new Date(item.created_at).toLocaleTimeString(),
  })) || [];

  // Map titles to icons
  const getIcon = (title) => {
    if (title.includes('Water')) return <Droplets className="w-5 h-5 text-white" />;
    if (title.includes('Air')) return <Wind className="w-5 h-5 text-white" />;
    if (title.includes('Humidity')) return <Droplets className="w-5 h-5 text-white" />;
    if (title.includes('TDS')) return <Gauge className="w-5 h-5 text-white" />;
    if (title.includes('pH')) return <Activity className="w-5 h-5 text-white" />;
    if (title.includes('Temperature')) return <Thermometer className="w-5 h-5 text-white" />;
    return <Activity className="w-5 h-5 text-white" />;
  };

  // Map titles to gradient colors
  const getGradient = (title) => {
    if (title.includes('Water')) return 'from-blue-500 to-cyan-500';
    if (title.includes('Air')) return 'from-orange-500 to-yellow-500';
    if (title.includes('Humidity')) return 'from-blue-400 to-indigo-500';
    if (title.includes('TDS')) return 'from-green-500 to-emerald-500';
    if (title.includes('pH')) return 'from-purple-500 to-violet-500';
    if (title.includes('Temperature')) return 'from-red-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
    >
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${getGradient(title)} rounded-lg flex items-center justify-center mr-3`}>
          {getIcon(title)}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `Time: ${payload[0].payload.fullTime}`;
                }
                return `Time: ${label}`;
              }}
              formatter={(value) => [`${value}`, title]}
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
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ChartBox;