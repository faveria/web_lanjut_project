import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSensorData } from '../hooks/useWebSocket';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw, Bell, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const { updatePollingInterval } = useSensorData();
  const { theme, setTheme } = useTheme();
  const [pollingInterval, setPollingInterval] = useState(3000);

  const handlePollingIntervalChange = (e) => {
    const value = parseInt(e.target.value);
    setPollingInterval(value);
    updatePollingInterval(value);
  };

  const intervals = [
    { value: 1000, label: '1 second' },
    { value: 3000, label: '3 seconds' },
    { value: 5000, label: '5 seconds' },
    { value: 10000, label: '10 seconds' },
    { value: 30000, label: '30 seconds' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-300">Customize your monitoring experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Refresh Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-primary-500" />
                <span>Data Refresh Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-gray-300">
                  Refresh Interval
                </label>
                <select
                  value={pollingInterval}
                  onChange={handlePollingIntervalChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {intervals.map(interval => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                  How often the dashboard updates with new sensor data
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary-500" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications for system alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 dark:bg-gray-700 dark:peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Browser notifications for critical alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 dark:bg-gray-700 dark:peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-primary-500" />
                <span>Theme Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    theme === 'light' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400' 
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 dark:text-white" />
                  <span className={`font-medium ${theme === 'light' ? 'dark:text-white' : 'dark:text-gray-300'}`}>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    theme === 'dark' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400' 
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 dark:text-white" />
                  <span className={`font-medium ${theme === 'dark' ? 'dark:text-white' : 'dark:text-gray-300'}`}>Dark</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">API Version</span>
                <span className="font-medium dark:text-white">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Frontend Version</span>
                <span className="font-medium dark:text-white">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="font-medium dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">Operational</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end space-x-4 pt-6"
      >
        <Button variant="outline" className="border-gray-300">
          Reset to Defaults
        </Button>
        <Button className="bg-primary-500 hover:bg-primary-600">
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;