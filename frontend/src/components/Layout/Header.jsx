import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Settings, Menu, X, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Header = ({ sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  // Fetch subscription info when component mounts
  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && user) {
          const response = await axios.get(
            'https://api.hyyyume.my.id/api/subscription/status',
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }
          );
          
          if (response.data.success) {
            setSubscriptionInfo(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      }
    };

    fetchSubscriptionInfo();
  }, [user]);

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!subscriptionInfo?.subscriptionEndDate) return null;
    
    const endDate = new Date(subscriptionInfo.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sm:px-6 sm:py-4 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 lg:hidden dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
          
          {/* Desktop toggle button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 hidden lg:flex dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <img 
            src="/favicon.png" 
            alt="HY.YUME Logo" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">HY.YUME Monitor</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block dark:text-gray-400">Smart Hydroponic IoT System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Subscription info display */}
          <div className="hidden sm:flex items-center space-x-3">
            {subscriptionInfo ? (
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="text-xs">
                  {subscriptionInfo.subscriptionType === 'free' ? (
                    <span className="text-blue-800 font-medium dark:text-blue-200">Free Plan</span>
                  ) : (
                    <div>
                      <span className="text-blue-800 font-medium dark:text-blue-200 capitalize">
                        {subscriptionInfo.subscriptionType} Plan
                      </span>
                      {daysRemaining !== null && daysRemaining > 0 ? (
                        <p className="text-blue-600 dark:text-blue-300">
                          Ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                        </p>
                      ) : daysRemaining === 0 ? (
                        <p className="text-red-600 dark:text-red-300">Expires today</p>
                      ) : (
                        <p className="text-red-600 dark:text-red-300">Expired</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-800 font-medium dark:text-gray-200">Loading...</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] dark:text-white">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;