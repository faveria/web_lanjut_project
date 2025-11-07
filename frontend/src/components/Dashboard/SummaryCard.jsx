import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, Zap } from 'lucide-react';

const SummaryCard = ({ loading, onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center mb-2">
            <Activity className="w-6 h-6 text-primary-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Real-time hydroponic system monitoring</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`
            px-4 py-2 rounded-lg border flex items-center space-x-2
            ${loading 
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-400' 
              : 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100 dark:bg-gray-700/70 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SummaryCard;