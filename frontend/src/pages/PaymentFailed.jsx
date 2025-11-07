import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Home, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4 dark:from-red-900/20 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center dark:bg-red-900/30">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3 dark:text-white">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-8 dark:text-gray-300">
          Your payment could not be processed. Please try again or contact support 
          if you continue to experience issues.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/subscription')}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;