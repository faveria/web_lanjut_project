import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-300">Manage your account information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="dark:text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center dark:bg-primary-600">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Standard User</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                  <div className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
                <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:border">
                  <code className="text-sm text-gray-600 dark:text-gray-300">{user?.id}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">System Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Dashboard Access</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Real-time Data</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">API Access</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/50">
                  Change Password
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/50">
                  Notification Settings
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/50">
                  Export Data
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;