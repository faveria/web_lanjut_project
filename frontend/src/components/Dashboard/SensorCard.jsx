import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Gauge, Wind, TestTube, ToggleLeft } from 'lucide-react';
import { SENSOR_THRESHOLDS, SENSOR_UNITS, SENSOR_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const iconMap = {
  suhu_air: Thermometer,
  suhu_udara: Wind,
  kelembapan: Droplets,
  tds: Gauge,
  ph: TestTube,
  pompa: ToggleLeft,
};

const getStatusColor = (type, value) => {
  // Special handling for pompa (pump) which is ON/OFF
  if (type === 'pompa') {
    return value === 'ON' ? 'text-green-500' : 'text-gray-500';
  }
  
  const threshold = SENSOR_THRESHOLDS[type];
  if (!threshold) return 'text-gray-600';
  
  if (value < threshold.min || value > threshold.max) {
    return 'text-red-500';
  }
  return 'text-green-500';
};

const getStatusText = (type, value) => {
  // Special handling for pompa (pump) which is ON/OFF
  if (type === 'pompa') {
    return value === 'ON' ? 'Active' : 'Inactive';
  }
  
  const threshold = SENSOR_THRESHOLDS[type];
  if (!threshold) return 'Normal';
  
  if (value < threshold.min) return 'Too Low';
  if (value > threshold.max) return 'Too High';
  return 'Normal';
};

const SensorCard = ({ type, value, loading }) => {
  const Icon = iconMap[type];
  const unit = SENSOR_UNITS[type];
  const label = SENSOR_LABELS[type];
  const statusColor = value != null && value !== undefined ? getStatusColor(type, value) : 'text-gray-600';
  const statusText = value != null && value !== undefined ? getStatusText(type, value) : 'No Data';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{label}</h3>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          type === 'suhu_air' ? "bg-gradient-to-br from-red-500 to-red-600" :
          type === 'suhu_udara' ? "bg-gradient-to-br from-orange-500 to-orange-600" :
          type === 'kelembapan' ? "bg-gradient-to-br from-blue-500 to-blue-600" :
          type === 'tds' ? "bg-gradient-to-br from-green-500 to-green-600" :
          type === 'ph' ? "bg-gradient-to-br from-purple-500 to-purple-600" :
          "bg-gradient-to-br from-gray-500 to-gray-600"
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 w-16"></div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {value != null && value !== undefined ? value : '--'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
          </div>
          <div className={cn(
            'text-sm font-medium px-3 py-1 rounded-full inline-block mt-2',
            statusColor === 'text-red-500' 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
              : statusColor === 'text-green-500'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          )}>
            {statusText}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SensorCard;