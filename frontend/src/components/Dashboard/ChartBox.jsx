import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ChartBox = ({ data, title, dataKey, color = '#00A884' }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const chartData = data?.map(item => ({
    time: formatTime(item.created_at),
    value: item[dataKey],
    fullTime: new Date(item.created_at).toLocaleTimeString(),
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:stroke-gray-600" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  interval="preserveStartEnd"
                  tickMargin={10}
                  stroke="currentColor"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  width={40}
                  tickMargin={10}
                  stroke="currentColor"
                />
                <Tooltip 
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `Time: ${payload[0].payload.fullTime}`;
                    }
                    return `Time: ${label}`;
                  }}
                  formatter={(value) => [`${value}`, title]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'inherit'
                  }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChartBox;