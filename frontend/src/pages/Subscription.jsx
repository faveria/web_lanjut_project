import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const plans = [
    {
      id: 'monthly',
      name: '1 Month Plan',
      price: 'IDR 29,000',
      description: 'Perfect for getting started',
      features: ['Full access to all features', 'Real-time monitoring', 'Email support', 'Basic analytics'],
    },
    {
      id: 'quarterly',
      name: '3 Months Plan',
      price: 'IDR 69,000',
      description: 'Best for regular users',
      features: ['All monthly features', 'Priority support', 'Advanced analytics', 'Discounted rate'],
      popular: true,
    },
    {
      id: 'annual',
      name: '1 Year Plan',
      price: 'IDR 259,000',
      description: 'Best value for power users',
      features: ['All quarterly features', '24/7 premium support', 'Custom reports', 'Maximum discount'],
    },
  ];

  const handleSubscribe = async (planId) => {
    setIsLoading(true);
    setPaymentUrl(null);
    
    try {
      // This assumes you have the API endpoint ready
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://api.hyyyume.my.id/api/subscription/create-invoice',
        { planId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setPaymentUrl(response.data.data.invoiceUrl);
        // Open the payment page in a new tab
        window.open(response.data.data.invoiceUrl, '_blank');
      } else {
        alert('Error creating invoice: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice: ' + error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Subscription Plans
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan for your hydroponic monitoring needs. All plans include full access to our platform.
        </p>
      </motion.div>

      {paymentUrl && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 dark:bg-green-900/20 dark:border-green-800"
        >
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200">
              Invoice generated successfully! You can access the payment page{' '}
              <a 
                href={paymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                here
              </a>
              .
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl border-2 p-6 shadow-lg ${
              plan.popular
                ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{plan.price}</div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSubscribe(plan.id)}
              disabled={isLoading}
              className={`w-full ${
                plan.popular
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscribe Now
                </div>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-gray-50 rounded-xl p-6 dark:bg-gray-800/50"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment Security</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Your payment information is securely processed through Xendit, a trusted payment gateway. 
          We do not store your payment details on our servers.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            <span>Trusted by businesses worldwide</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Subscription;