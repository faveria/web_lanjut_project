import React from 'react';
import { motion } from 'framer-motion';

const LastUpdatedCard = ({ sensorData }) => {
  if (!sensorData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-sm text-gray-500"
    >
      Last updated: {new Date(sensorData.created_at).toLocaleString()}
    </motion.div>
  );
};

export default LastUpdatedCard;