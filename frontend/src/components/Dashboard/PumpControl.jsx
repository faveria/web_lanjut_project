import React from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, Droplets } from 'lucide-react';

const PumpControl = ({ pumpStatus, onPumpControl, isControlling }) => {
  const isOn = pumpStatus === 'ON';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mr-3">
            <ToggleLeft className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pump Control</h3>
        </div>
        <div className={`w-3 h-3 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      </div>
      
      {/* Status Display */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {pumpStatus != null && pumpStatus !== undefined ? pumpStatus : '--'}
            </span>
            <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block mt-2 ${
              isOn ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {isOn ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div 
              onClick={() => pumpStatus != null && pumpStatus !== undefined && !isControlling && onPumpControl(isOn ? 'OFF' : 'ON')}
              className={`relative inline-flex items-center h-7 rounded-full w-16 cursor-pointer transition-all duration-300 ${
                isOn ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              } ${isControlling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span 
                className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg transition-all duration-300 ${
                  isOn ? 'translate-x-10' : 'translate-x-1'
                } ${isControlling ? 'animate-pulse' : ''}`}
              />
            </div>

            {/* Loading Indicator */}
            {isControlling && (
              <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center">
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PumpControl;