import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const PumpControl = ({ pumpStatus, onPumpControl, isControlling }) => {
  const isOn = pumpStatus === 'ON';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-0 md:pb-1 lg:pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md mb-2 md:text-lg lg:text-lg font-semibold text-gray-700 dark:text-gray-200">
              Pump Control
            </CardTitle>
            <div className={`w-2 h-2 md:w-6 md:h-6 lg:w-6 lg:h-6 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {pumpStatus != null && pumpStatus !== undefined ? pumpStatus : '--'}
                </span>
                {/* Status Label - selalu di bawah teks */}
                <div className={`hidden sm:hidden md:block text-sm font-medium px-2 py-1 rounded-full mt-1 ${isOn ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {isOn ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              {/* Toggle untuk desktop */}
              <div className="hidden sm:flex flex-col items-center space-y-3 pt-2">
                <div 
                  onClick={() => pumpStatus != null && pumpStatus !== undefined && onPumpControl(isOn ? 'OFF' : 'ON')}
                  className={`relative inline-flex items-center h-7 rounded-full w-16 cursor-pointer transition-all duration-300 ${
                    isOn ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  } ${isControlling ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span 
                    className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg transition-all duration-300 ${
                      isOn ? 'translate-x-8' : 'translate-x-1'
                    } ${isControlling ? 'animate-pulse' : ''}`}
                  />
                </div>

                {/* Loading Indicator */}
                {isControlling && (
                  <div className="mt-1 w-full text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-center">
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-0.5"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Toggle untuk mobile (di bawah teks) */}
            <div className="sm:hidden flex flex-col items-center space-y-3">
              <div 
                onClick={() => pumpStatus != null && pumpStatus !== undefined && onPumpControl(isOn ? 'OFF' : 'ON')}
                className={`relative inline-flex items-center h-7 rounded-full w-16 cursor-pointer transition-all duration-300 ${
                  isOn ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                } ${isControlling ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <span 
                  className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg transition-all duration-300 ${
                    isOn ? 'translate-x-8' : 'translate-x-1'
                  } ${isControlling ? 'animate-pulse' : ''}`}
                />
              </div>

              {/* Loading Indicator */}
              {isControlling && (
                <div className="w-full text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin mr-0.5"></div>
                  Loading...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PumpControl;