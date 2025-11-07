import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Shield, CreditCard, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-300">Manage your account information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h2>
            
            <div className="flex items-center space-x-6 p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">Standard User</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-xl border border-primary-200/30 dark:border-gray-600">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                  </div>
                  <span className="text-gray-900 dark:text-white flex-1">{user?.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 rounded-xl border border-primary-200/30 dark:border-gray-600">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                  </div>
                  <span className="text-gray-900 dark:text-white flex-1">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-primary-200/30 dark:border-gray-600">
                <code className="text-gray-900 dark:text-white break-all font-mono">{user?.id}</code>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Access</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Dashboard Access</span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Real-time Data</span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">API Access</span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full">Enabled</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-white">
                Change Password
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-white">
                Notification Settings
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-white">
                Export Data
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;