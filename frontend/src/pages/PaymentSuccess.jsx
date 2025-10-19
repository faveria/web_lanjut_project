import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { subscriptionAPI } from '../utils/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh subscription status immediately
    const refreshSubscription = async () => {
      try {
        await subscriptionAPI.getStatus();
        console.log('Subscription status refreshed');
      } catch (error) {
        console.error('Error refreshing subscription status:', error);
      }
    };

    refreshSubscription();

    // Optionally redirect to subscription page after a few seconds
    const timer = setTimeout(() => {
      navigate('/subscription');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4 dark:from-green-900/20 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/30">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3 dark:text-white">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8 dark:text-gray-300">
          Thank you for your subscription. Your payment has been processed successfully. 
          Your subscription benefits are now active.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/subscription')}
            className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            View Subscription
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;