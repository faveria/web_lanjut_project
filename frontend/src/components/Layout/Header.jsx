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
      className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sm:px-6 sm:py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 lg:hidden"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
          
          {/* Desktop toggle button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">HY.YUME Monitor</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Smart Hydroponic IoT System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{user?.email}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;