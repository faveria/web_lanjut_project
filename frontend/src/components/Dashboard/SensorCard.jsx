import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Gauge, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SENSOR_THRESHOLDS, SENSOR_UNITS, SENSOR_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const iconMap = {
  suhu_air: Thermometer,
  suhu_udara: Wind,
  kelembapan: Droplets,
  tds: Gauge,
};

const getStatusColor = (type, value) => {
  const threshold = SENSOR_THRESHOLDS[type];
  if (!threshold) return 'text-gray-600';
  
  if (value < threshold.min || value > threshold.max) {
    return 'text-red-500';
  }
  return 'text-green-500';
};

const getStatusText = (type, value) => {
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
  const statusColor = value ? getStatusColor(type, value) : 'text-gray-600';
  const statusText = value ? getStatusText(type, value) : 'No Data';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-700">
              {label}
            </CardTitle>
            <Icon className={cn('w-6 h-6', statusColor)} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  {value || '--'}
                </span>
                <span className="text-sm text-gray-500">{unit}</span>
              </div>
              <div className={cn(
                'text-sm font-medium px-2 py-1 rounded-full w-fit',
                statusColor === 'text-red-500' 
                  ? 'bg-red-100 text-red-700' 
                  : statusColor === 'text-green-500'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              )}>
                {statusText}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SensorCard;