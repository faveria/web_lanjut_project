import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle, ShieldAlert, Clock, Thermometer, Droplets, Gauge, Sun } from 'lucide-react';
import { alertAPI } from '../../utils/api';

const SmartAlerts = ({ userId, onAlertsChange }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'all'

  useEffect(() => {
    fetchAlerts();
  }, [viewMode]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertAPI.getUserAlerts(userId, {
        isResolved: viewMode === 'all' ? undefined : false
      });
      setAlerts(response.data.data);
      
      if (onAlertsChange) {
        onAlertsChange(response.data.data.filter(alert => !alert.isResolved));
      }
    } catch (err) {
      setError('Failed to load alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await alertAPI.resolveAlert(userId, alertId);
      fetchAlerts(); // Refresh the alerts list
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600 border-red-500/30';
      case 'high': return 'from-orange-500 to-orange-600 border-orange-500/30';
      case 'medium': return 'from-yellow-500 to-yellow-600 border-yellow-500/30';
      case 'low': return 'from-blue-500 to-blue-600 border-blue-500/30';
      default: return 'from-gray-500 to-gray-600 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-6 h-6" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6" />;
      case 'low':
        return <ShieldAlert className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getParameterIcon = (parameterName) => {
    switch (parameterName?.toLowerCase()) {
      case 'ph':
        return <Droplets className="w-5 h-5" />;
      case 'tds':
      case 'water temperature':
      case 'suhu_air':
        return <Thermometer className="w-5 h-5" />;
      case 'air temperature':
      case 'suhu_udara':
        return <Thermometer className="w-5 h-5" />;
      case 'humidity':
      case 'kelembapan':
        return <Gauge className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const formatParameterName = (parameterName) => {
    if (!parameterName) return 'System';
    switch (parameterName.toLowerCase()) {
      case 'suhu_air': return 'Water Temperature';
      case 'suhu_udara': return 'Air Temperature';
      case 'kelembapan': return 'Humidity';
      default: return parameterName;
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 dark:bg-red-900/20 dark:border-red-800">
        <div className="flex items-center text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Alerts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {viewMode === 'active' 
                ? 'Active alerts requiring attention' 
                : 'All alerts history'
              }
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('active')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'active'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Active ({alerts.filter(a => !a.isResolved).length})
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All ({alerts.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">No alerts</h4>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {viewMode === 'active' 
              ? 'All good! No active alerts requiring attention.'
              : 'No alerts found in your history.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  p-5 rounded-xl border bg-gradient-to-r shadow-sm
                  ${getSeverityColor(alert.severity)}
                  ${alert.isResolved 
                    ? 'opacity-60 border-opacity-50 dark:opacity-50' 
                    : 'border-opacity-30'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="mr-3">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{alert.title}</h4>
                        {alert.PlantProfile && (
                          <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs text-white/90 mt-1">
                            {alert.PlantProfile.name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-12 space-y-2">
                      <p className="text-white/90 text-sm">{alert.message}</p>
                      
                      {alert.parameterName && (
                        <div className="flex items-center text-white/80 text-xs">
                          <div className="flex items-center mr-4">
                            {getParameterIcon(alert.parameterName)}
                            <span className="ml-1">{formatParameterName(alert.parameterName)}</span>
                          </div>
                          <div>
                            <span>Value: {alert.currentValue}</span>
                            {alert.thresholdValue && <span>, Threshold: {alert.thresholdValue}</span>}
                          </div>
                        </div>
                      )}
                      
                      {alert.actionRequired && (
                        <div className="mt-3 p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center text-white/90 text-sm">
                            <Sun className="w-4 h-4 mr-2" />
                            <span><strong>Action:</strong> {alert.actionRequired}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-white/70 text-xs mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!alert.isResolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </button>
                  )}
                  
                  {alert.isResolved && (
                    <div className="ml-4 p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SmartAlerts;