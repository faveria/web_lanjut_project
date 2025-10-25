import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { SENSOR_THRESHOLDS } from '../../utils/constants';

const StatusAlert = ({ sensorData, onClose }) => {
  const getAlerts = () => {
    if (!sensorData) return [];

    const alerts = [];
    
    Object.keys(SENSOR_THRESHOLDS).forEach(key => {
      const value = sensorData[key];
      const threshold = SENSOR_THRESHOLDS[key];
      
      if (value !== undefined && value !== null) {
        if (value < threshold.min) {
          alerts.push(`${key.replace('_', ' ')} is too low (${value} < ${threshold.min})`);
        } else if (value > threshold.max) {
          alerts.push(`${key.replace('_', ' ')} is too high (${value} > ${threshold.max})`);
        }
      }
    });

    return alerts;
  };

  const alerts = getAlerts();

  if (alerts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-red-100 to-orange-100 border-l-4 border-l-red-500 rounded-2xl p-6 mb-6 dark:from-red-900/30 dark:to-orange-900/30 backdrop-blur-sm shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-800 dark:text-red-200">System Alert</h4>
              <ul className="mt-2 text-red-700 list-disc list-inside space-y-1 dark:text-red-300">
                {alerts.map((alert, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300 font-medium">{alert}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/50 hover:bg-white/80 transition-colors flex items-center justify-center dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusAlert;