import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const SummaryCard = ({ loading, onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-300">Real-time hydroponic system monitoring</p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${
            loading 
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SummaryCard;