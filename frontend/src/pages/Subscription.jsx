import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, RotateCcw, Sparkle, Zap, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { subscriptionAPI } from '../utils/api';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const plans = [
    {
      id: 'monthly',
      name: 'Starter',
      price: 'Rp 299K',
      period: '/month',
      description: 'Perfect for getting started',
      features: ['Full access to all features', 'Real-time monitoring', 'Email support', 'Basic analytics'],
    },
    {
      id: 'quarterly',
      name: 'Professional',
      price: 'Rp 799K',
      period: '/3 months',
      description: 'Best for regular users',
      features: ['All starter features', 'Priority support', 'Advanced analytics', 'Historical data (30 days)'],
      popular: true,
    },
    {
      id: 'annual',
      name: 'Enterprise',
      price: 'Rp 1.499K',
      period: '/year',
      description: 'Best value for power users',
      features: ['All professional features', 'Unlimited devices', '24/7 premium support', 'Custom reports', 'Historical data (unlimited)'],
    },
  ];

  const handleSubscribe = async (planId) => {
    setIsLoading(true);
    setPaymentUrl(null);
    
    try {
      // Call the actual API to create an invoice
      const response = await subscriptionAPI.createInvoice(planId);
      
      if (response.data.success && response.data.data.invoiceUrl) {
        setPaymentUrl(response.data.data.invoiceUrl);
        
        // Open the payment page in a new tab
        window.open(response.data.data.invoiceUrl, '_blank');
        
        // Show user a message to indicate where to return after payment
        alert('You will be redirected to the payment page. Please complete your payment and return to the dashboard to see your subscription status.');
      } else {
        alert('Error creating invoice: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-blue-100 rounded-full text-primary-700 dark:from-primary-900/30 dark:to-blue-900/30 dark:text-primary-300 mb-4">
          <Sparkle className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Subscription Plans</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your <span className="text-primary-600">Plan</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Select the perfect plan for your hydroponic monitoring needs. All plans include full access to our platform.
        </p>
      </motion.div>

      {paymentUrl && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl p-6 mb-8 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <Check className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-800 dark:text-gray-200 flex-1">
              Invoice generated successfully! You can access the payment page{' '}
              <a 
                href={paymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium underline text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                here
              </a>
              .
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl shadow-xl border ${
              plan.popular
                ? 'border-primary-500 bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-gray-900 ring-2 ring-primary-500/20 scale-105'
                : 'bg-white/70 dark:bg-gray-800/70 border-primary-200/30 dark:border-gray-700 backdrop-blur-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 md:mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading}
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-white'
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
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 md:mt-16 bg-gradient-to-br from-slate-50 to-primary-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-primary-200/30 dark:border-gray-700"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Payment Security</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
          Your payment information is securely processed through Xendit, a trusted payment gateway. 
          We do not store your payment details on our servers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="flex items-center p-3 md:p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-primary-200/30 dark:border-gray-600">
            <Shield className="w-5 h-5 text-green-500 mr-3" />
            <span className="font-medium text-gray-700 dark:text-gray-300">PCI DSS Compliant</span>
          </div>
          <div className="flex items-center p-3 md:p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-primary-200/30 dark:border-gray-600">
            <Zap className="w-5 h-5 text-green-500 mr-3" />
            <span className="font-medium text-gray-700 dark:text-gray-300">256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center p-3 md:p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-primary-200/30 dark:border-gray-600">
            <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Trusted by businesses worldwide</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Subscription;