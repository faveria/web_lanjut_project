import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const LastUpdatedCard = ({ sensorData }) => {
  if (!sensorData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-4"
    >
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
        <Clock className="w-4 h-4 mr-2" />
        <span className="text-sm">Last updated: {new Date(sensorData.created_at).toLocaleString()}</span>
      </div>
    </motion.div>
  );
};

export default LastUpdatedCard;