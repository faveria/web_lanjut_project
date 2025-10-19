import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, Droplets } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const PumpControl = ({ pumpStatus, onPumpControl }) => {
  const [isSending, setIsSending] = useState(false);

  const togglePump = async (status) => {
    setIsSending(true);
    try {
      await onPumpControl(status);
    } catch (error) {
      console.error('Error controlling pump:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Pump Control
          </CardTitle>
          <div className="text-2xl">
            {pumpStatus === 'ON' ? '💧' : '🚫'}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Current Status:
            </span>
            <span className={`font-bold ${pumpStatus === 'ON' ? 'text-green-600' : 'text-gray-500'}`}>
              {pumpStatus || 'Unknown'}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => togglePump('ON')}
              disabled={isSending || pumpStatus === 'ON'}
              className={`flex-1 ${pumpStatus === 'ON' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              <Droplets className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Turn ON'}
            </Button>
            
            <Button
              onClick={() => togglePump('OFF')}
              disabled={isSending || pumpStatus === 'OFF'}
              variant="outline"
              className={`flex-1 ${pumpStatus === 'OFF' ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
            >
              <ToggleLeft className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Turn OFF'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PumpControl;