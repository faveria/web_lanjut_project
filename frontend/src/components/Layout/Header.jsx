import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen }) => {
  const { user, logout } = useAuth();

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
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] dark:text-white">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;