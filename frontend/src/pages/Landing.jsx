import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Monitor, 
  Zap, 
  Globe, 
  Leaf, 
  ArrowRight,
  TrendingUp,
  Shield,
  Cloud
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Monitor,
      title: 'Realtime Watch',
      description: 'Track your hydroponic system parameters in real-time with live data updates.'
    },
    {
      icon: Zap,
      title: 'Smart Efficiency',
      description: 'Optimize resource usage with intelligent monitoring and automated insights.'
    },
    {
      icon: Globe,
      title: 'Remote Access',
      description: 'Monitor and manage your hydroponic system from anywhere in the world.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable farming with reduced water consumption and optimal nutrient usage.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/favicon.png" 
              alt="HY.YUME Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">HY.YUME</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 dark:text-white">
              HY.YUME{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300">
                Monitor
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
              Smart Hydroponic IoT System – Monitor, Analyze, and Optimize Your Hydroponic Farm in Real-Time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-primary-500 hover:bg-primary-600 px-8 py-3 text-lg dark:bg-primary-600 dark:hover:bg-primary-700">
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
  const Icon = feature.icon;
  return (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
    >
      {/* Pusatkan logo + judul bersama-sama */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center dark:bg-primary-900/30">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
          {feature.title}
        </h3>
      </div>

      {/* Deskripsi */}
      <p className="text-gray-600 leading-relaxed dark:text-gray-300 text-center">
        {feature.description}
      </p>
    </motion.div>
  );
})}

          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TrendingUp className="w-8 h-8 text-primary-500 mx-auto mb-2 dark:text-primary-400" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
              <div className="text-gray-600 dark:text-gray-300">Uptime</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Cloud className="w-8 h-8 text-primary-500 mx-auto mb-2 dark:text-primary-400" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">Monitoring</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Leaf className="w-8 h-8 text-primary-500 mx-auto mb-2 dark:text-primary-400" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">50%</div>
              <div className="text-gray-600 dark:text-gray-300">Water Saved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Shield className="w-8 h-8 text-primary-500 mx-auto mb-2 dark:text-primary-400" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Secure</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/favicon.png" 
              alt="HY.YUME Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold dark:text-white">HY.YUME Monitor</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500">
            © 2024 HY.YUME Monitor. All rights reserved. Smart Hydroponic IoT System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;