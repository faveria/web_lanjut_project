import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSensorData } from '../hooks/useWebSocket';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { RefreshCw, Bell, Moon, Sun, Zap, Shield, Package, Activity, Leaf, Plus, X } from 'lucide-react';
import PlantProfileSelector from '../components/Dashboard/PlantProfileSelector';
import { plantAPI } from '../utils/api';

const Settings = () => {
  const { updatePollingInterval } = useSensorData();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [pollingInterval, setPollingInterval] = useState(3000);
  const [userPlants, setUserPlants] = useState([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [showPlantSelector, setShowPlantSelector] = useState(false);

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

  useEffect(() => {
    if (user) {
      loadUserPlants();
    }
  }, [user]);

  const loadUserPlants = async () => {
    if (!user) return;
    
    try {
      setLoadingPlants(true);
      const response = await plantAPI.getUserPlantSettings(user.id);
      setUserPlants(response.data.data);
    } catch (error) {
      console.error('Error loading user plants:', error);
    } finally {
      setLoadingPlants(false);
    }
  };

  const handleAddPlant = async (plant) => {
    try {
      await plantAPI.addUserPlant(user.id, { plantProfileId: plant.id });
      loadUserPlants(); // Refresh the list
      setShowPlantSelector(false);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  const handleRemovePlant = async (plantId) => {
    try {
      await plantAPI.removeUserPlant(user.id, plantId);
      loadUserPlants(); // Refresh the list
    } catch (error) {
      console.error('Error removing plant:', error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-300">Customize your monitoring experience</p>
      </motion.div>

      {/* Plant Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Plant Management</h2>
        </div>
        
        <div className="mb-6">
          <button
            onClick={() => setShowPlantSelector(!showPlantSelector)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showPlantSelector ? 'Hide' : 'Add Plants'} to Garden
          </button>
        </div>

        {showPlantSelector && (
          <div className="mb-6">
            <PlantProfileSelector 
              userId={user?.id}
              selectedPlants={userPlants}
              onPlantSelect={() => {}}
              onRemovePlant={handleRemovePlant}
              onAddPlant={handleAddPlant}
            />
          </div>
        )}

        {/* User's Active Plants */}
        {loadingPlants ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : userPlants.length > 0 ? (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Active Garden ({userPlants.length} plants)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPlants.map((selectedPlant) => (
                <div 
                  key={selectedPlant.id}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-green-200/30 dark:border-gray-600 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{selectedPlant.PlantProfile.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlant.PlantProfile.scientificName}</p>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 inline-block">
                      {selectedPlant.growthPhase}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemovePlant(selectedPlant.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No plants in your garden yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add plants to get personalized recommendations</p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Refresh Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Refresh Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-gray-300">
                  Refresh Interval
                </label>
                <select
                  value={pollingInterval}
                  onChange={handlePollingIntervalChange}
                  className="w-full p-3 border border-primary-200/30 rounded-lg focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-primary-200/30 dark:border-gray-600">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications for system alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 dark:bg-gray-600 dark:peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-primary-200/30 dark:border-gray-600">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Browser notifications for critical alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 dark:bg-gray-600 dark:peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 border-2 rounded-lg text-center transition-all flex flex-col items-center ${
                    theme === 'light' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400' 
                      : 'border-primary-200/30 hover:border-primary-300 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                >
                  <Sun className="w-6 h-6 mb-2 dark:text-white" />
                  <span className={`font-medium ${theme === 'light' ? 'dark:text-white' : 'dark:text-gray-300'}`}>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 border-2 rounded-lg text-center transition-all flex flex-col items-center ${
                    theme === 'dark' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400' 
                      : 'border-primary-200/30 hover:border-primary-300 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                >
                  <Moon className="w-6 h-6 mb-2 dark:text-white" />
                  <span className={`font-medium ${theme === 'dark' ? 'dark:text-white' : 'dark:text-gray-300'}`}>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Information</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-primary-200/30 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">API Version</span>
                <span className="font-medium dark:text-white">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-primary-200/30 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">Frontend Version</span>
                <span className="font-medium dark:text-white">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-primary-200/30 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="font-medium dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full">Operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end space-x-4 pt-6"
      >
        <Button 
          variant="outline" 
          className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30"
        >
          Reset to Defaults
        </Button>
        <Button className="bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 dark:from-primary-600 dark:to-blue-600 dark:hover:from-primary-700 dark:hover:to-blue-700">
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;