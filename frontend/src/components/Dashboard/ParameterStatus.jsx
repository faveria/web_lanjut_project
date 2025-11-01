import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, Gauge, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ParameterStatus = ({ sensorData, optimalParameters, parameter }) => {
  if (!sensorData || !optimalParameters) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 h-32 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Waiting for data...</p>
      </div>
    );
  }

  const getValue = () => {
    switch (parameter) {
      case 'ph': return sensorData.ph;
      case 'tds': return sensorData.tds;
      case 'waterTemp': return sensorData.suhu_air;
      case 'airTemp': return sensorData.suhu_udara;
      case 'humidity': return sensorData.kelembapan;
      default: return null;
    }
  };

  const getOptimalRange = () => {
    switch (parameter) {
      case 'ph': return { min: optimalParameters.ph?.min, max: optimalParameters.ph?.max };
      case 'tds': return { min: optimalParameters.tds?.min, max: optimalParameters.tds?.max };
      case 'waterTemp': return { min: optimalParameters.waterTemp?.min, max: optimalParameters.waterTemp?.max };
      case 'airTemp': return { min: optimalParameters.airTemp?.min, max: optimalParameters.airTemp?.max };
      case 'humidity': return { min: optimalParameters.humidity?.min, max: optimalParameters.humidity?.max };
      default: return { min: null, max: null };
    }
  };

  const currentValue = getValue();
  const optimalRange = getOptimalRange();
  
  if (currentValue === null || currentValue === undefined) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 h-32 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">No data</p>
        </div>
      </div>
    );
  }

  // Determine status based on optimal range
  let status = 'optimal'; // green
  if (currentValue < optimalRange.min || currentValue > optimalRange.max) {
    status = 'warning'; // yellow
  } else if (
    (currentValue <= optimalRange.min + (optimalRange.max - optimalRange.min) * 0.1) ||
    (currentValue >= optimalRange.max - (optimalRange.max - optimalRange.min) * 0.1)
  ) {
    status = 'caution'; // orange (near the edges of optimal range)
  }

  // Get status colors and icons
  const getStatusProps = () => {
    switch (status) {
      case 'optimal':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-700 dark:text-green-300',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        };
      case 'caution':
        return {
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-700 dark:text-orange-300',
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />
        };
      case 'warning':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-700 dark:text-red-300',
          icon: <XCircle className="w-5 h-5 text-red-500" />
        };
      default:
        return {
          bgColor: 'bg-gray-50 dark:bg-gray-700',
          borderColor: 'border-gray-200 dark:border-gray-600',
          textColor: 'text-gray-700 dark:text-gray-300',
          icon: <Activity className="w-5 h-5 text-gray-500" />
        };
    }
  };

  const statusProps = getStatusProps();

  // Get parameter label and unit
  const getParameterInfo = () => {
    switch (parameter) {
      case 'ph': 
        return { label: 'pH Level', unit: '', icon: <Droplets className="w-4 h-4" />, color: 'text-blue-500' };
      case 'tds': 
        return { label: 'TDS', unit: 'ppm', icon: <Gauge className="w-4 h-4" />, color: 'text-green-500' };
      case 'waterTemp': 
        return { label: 'Water Temp', unit: '°C', icon: <Thermometer className="w-4 h-4" />, color: 'text-blue-500' };
      case 'airTemp': 
        return { label: 'Air Temp', unit: '°C', icon: <Thermometer className="w-4 h-4" />, color: 'text-red-500' };
      case 'humidity': 
        return { label: 'Humidity', unit: '%', icon: <Droplets className="w-4 h-4" />, color: 'text-blue-500' };
      default: 
        return { label: parameter, unit: '', icon: <Activity className="w-4 h-4" />, color: 'text-gray-500' };
    }
  };

  const paramInfo = getParameterInfo();

  // Calculate progress for the bar visualization
  const calculateProgress = () => {
    if (!optimalRange.min || !optimalRange.max) return 0;
    
    // For visualization, we'll map the value to a percentage between 0 and 100
    // based on a reasonable range around the optimal values
    let minRange, maxRange;
    
    switch (parameter) {
      case 'ph':
        minRange = 4; // pH typically ranges from 4-8
        maxRange = 8;
        break;
      case 'tds':
        minRange = 0; // TDS range depends on context
        maxRange = 2000;
        break;
      case 'waterTemp':
      case 'airTemp':
        minRange = 10; // Temperature range
        maxRange = 35;
        break;
      case 'humidity':
        minRange = 0; // Humidity 0-100%
        maxRange = 100;
        break;
      default:
        minRange = 0;
        maxRange = 100;
    }
    
    // Calculate percentage based on the full range
    const percentage = ((currentValue - minRange) / (maxRange - minRange)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const progress = calculateProgress();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${statusProps.bgColor} ${statusProps.borderColor} border rounded-xl p-4 h-full`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className={paramInfo.color}>{paramInfo.icon}</span>
          <h4 className={`ml-2 font-semibold ${statusProps.textColor}`}>{paramInfo.label}</h4>
        </div>
        {statusProps.icon}
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <div className={`text-2xl font-bold ${statusProps.textColor}`}>
            {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
            <span className="text-sm font-normal ml-1">{paramInfo.unit}</span>
          </div>
          <div className={`text-xs ${statusProps.textColor}`}>
            Optimal: {optimalRange.min}-{optimalRange.max}{paramInfo.unit}
          </div>
        </div>
      </div>

      {/* Progress bar visualization */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              status === 'optimal' ? 'bg-green-500' :
              status === 'caution' ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ParameterStatus;