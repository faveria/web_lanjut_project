import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, User, Settings, Droplets } from 'lucide-react';
import { cn } from '../../utils/cn';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ currentPath, onNavigate }) => {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white border-r border-gray-200 h-full py-6"
    >
      <div className="px-6 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">HY.YUME</span>
        </div>
      </div>

      <nav className="space-y-2 px-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'w-5 h-5',
                isActive ? 'text-primary-500' : 'text-gray-400'
              )} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <p className="text-sm text-primary-700 font-medium">System Status</p>
          <p className="text-xs text-primary-600 mt-1">All sensors operational</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;