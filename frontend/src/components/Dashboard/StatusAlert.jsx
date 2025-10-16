import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
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
        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 dark:bg-red-900/20 dark:border-red-800/50"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0 dark:text-red-400" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">System Alert</h4>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside space-y-1 dark:text-red-300">
                {alerts.map((alert, index) => (
                  <li key={index}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors dark:text-red-300 dark:hover:text-red-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusAlert;