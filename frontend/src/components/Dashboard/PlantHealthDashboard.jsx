import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Thermometer, Gauge, AlertTriangle, CheckCircle, Activity, Clock, TrendingUp, Calendar } from 'lucide-react';
import ParameterStatus from './ParameterStatus';
import SmartAlerts from './SmartAlerts';
import { plantAPI, recommendationAPI } from '../../utils/api';

const PlantHealthDashboard = ({ userId, sensorData }) => {
  const [userPlants, setUserPlants] = useState([]);
  const [plantOptimalParameters, setPlantOptimalParameters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    loadPlantData();
  }, [userId]);

  useEffect(() => {
    if (userId && userPlants.length > 0) {
      loadRecommendations();
    }
  }, [userId, userPlants]);

  const loadPlantData = async () => {
    try {
      setLoading(true);
      
      // Get user's plants
      const plantsResponse = await plantAPI.getUserPlantOptimalParameters(userId);
      setUserPlants(plantsResponse.data.data);
      setPlantOptimalParameters(plantsResponse.data.data);
    } catch (error) {
      console.error('Error loading plant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await recommendationAPI.getGrowthRecommendations(userId);
      setRecommendations(response.data.data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleAlertsChange = (alerts) => {
    setActiveAlerts(alerts);
  };

  // Calculate health summary
  const calculateHealthSummary = () => {
    if (!sensorData || !plantOptimalParameters || plantOptimalParameters.length === 0) {
      return { overallHealth: 'unknown', message: 'No plant data available' };
    }

    // For simplicity, we'll calculate based on the first plant's parameters
    // In a real implementation, you'd average across all plants
    const firstPlantParams = plantOptimalParameters[0].optimalParameters;
    
    const checks = [
      sensorData.ph >= firstPlantParams.ph.min && sensorData.ph <= firstPlantParams.ph.max,
      sensorData.tds >= firstPlantParams.tds.min && sensorData.tds <= firstPlantParams.tds.max,
      sensorData.suhu_air >= firstPlantParams.waterTemp.min && sensorData.suhu_air <= firstPlantParams.waterTemp.max,
      sensorData.suhu_udara >= firstPlantParams.airTemp.min && sensorData.suhu_udara <= firstPlantParams.airTemp.max,
      sensorData.kelembapan >= firstPlantParams.humidity.min && sensorData.kelembapan <= firstPlantParams.humidity.max
    ];

    const healthyChecks = checks.filter(check => check).length;
    const totalChecks = checks.length;
    const healthPercentage = Math.round((healthyChecks / totalChecks) * 100);

    let status = 'poor';
    let message = 'Conditions need immediate attention';
    
    if (healthPercentage >= 80) {
      status = 'excellent';
      message = 'Optimal growing conditions';
    } else if (healthPercentage >= 60) {
      status = 'good';
      message = 'Good growing conditions';
    } else if (healthPercentage >= 40) {
      status = 'fair';
      message = 'Conditions need attention';
    }

    return { overallHealth: status, message, percentage: healthPercentage };
  };

  const healthSummary = calculateHealthSummary();

  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-500 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'good': return 'text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'fair': return 'text-yellow-500 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'poor': return 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Plant Health Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Health */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl border border-green-200/30 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Overall Health</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(healthSummary.overallHealth)}`}>
                {healthSummary.overallHealth}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{healthSummary.message}</p>
            {healthSummary.percentage !== undefined && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    healthSummary.overallHealth === 'excellent' ? 'bg-green-500' :
                    healthSummary.overallHealth === 'good' ? 'bg-blue-500' :
                    healthSummary.overallHealth === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${healthSummary.percentage}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Active Alerts */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl border border-red-200/30 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Alerts</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeAlerts.length === 0 
                  ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                  : activeAlerts.length <= 2
                    ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
                    : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
              }`}>
                {activeAlerts.length}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {activeAlerts.length === 0 
                ? 'All systems normal' 
                : 'Issues requiring attention'}
            </p>
          </div>

          {/* Plant Count */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl border border-blue-200/30 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Plants</h3>
              <div className="px-3 py-1 rounded-full text-sm font-medium text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30">
                {userPlants.length}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">In your garden</p>
          </div>
        </div>
      </motion.div>

      {/* Plant-specific Parameter Status */}
      {plantOptimalParameters.length > 0 && sensorData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {plantOptimalParameters[0].plantName} Parameters
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ParameterStatus
              sensorData={sensorData}
              optimalParameters={plantOptimalParameters[0].optimalParameters}
              parameter="ph"
            />
            <ParameterStatus
              sensorData={sensorData}
              optimalParameters={plantOptimalParameters[0].optimalParameters}
              parameter="tds"
            />
            <ParameterStatus
              sensorData={sensorData}
              optimalParameters={plantOptimalParameters[0].optimalParameters}
              parameter="waterTemp"
            />
            <ParameterStatus
              sensorData={sensorData}
              optimalParameters={plantOptimalParameters[0].optimalParameters}
              parameter="airTemp"
            />
            <ParameterStatus
              sensorData={sensorData}
              optimalParameters={plantOptimalParameters[0].optimalParameters}
              parameter="humidity"
            />
          </div>
        </motion.div>
      )}

      {/* Smart Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SmartAlerts userId={userId} onAlertsChange={handleAlertsChange} />
      </motion.div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Growth Recommendations</h2>
          </div>

          <div className="space-y-4">
            {recommendations.map((plantRec, index) => (
              <div key={index} className="border border-gray-200/30 dark:border-gray-600 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{plantRec.plantName}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {plantRec.growthPhase}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {plantRec.recommendations.slice(0, 3).map((rec, recIndex) => (
                    <div key={recIndex} className={`p-3 rounded-lg border-l-4 ${
                      rec.priority === 'high' ? 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500' :
                      rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-500' :
                      'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500'
                    }`}>
                      <div className="flex items-start">
                        <div className={`mr-3 mt-0.5 ${
                          rec.priority === 'high' ? 'text-red-500' :
                          rec.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {rec.priority === 'high' ? <AlertTriangle className="w-4 h-4" /> :
                           rec.priority === 'medium' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{rec.recommendation}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rec.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plant List */}
      {userPlants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Garden</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-green-200/30 dark:border-gray-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{plant.plantName}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {plant.growthPhase}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {plant.plantedDate ? `Planted: ${new Date(plant.plantedDate).toLocaleDateString()}` : 'Not planted yet'}
                    </span>
                  </div>
                  {plant.expectedHarvestDate && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Harvest: {new Date(plant.expectedHarvestDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlantHealthDashboard;