import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, User, Settings, Droplets, LogOut, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ currentPath, onNavigate }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle navigation and close mobile sidebar
  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    
    // Close mobile sidebar after navigation
    if (window.innerWidth < 1024) { // lg breakpoint
      const event = new CustomEvent('closeMobileSidebar');
      window.dispatchEvent(event);
    }
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-full bg-white border-r border-gray-200 h-full flex flex-col min-h-0"
    >
      <div>
        <button 
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          onClick={() => {
            const event = new CustomEvent('closeMobileSidebar');
            window.dispatchEvent(event);
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 sm:px-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-all duration-200',
                'mb-1',
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

      <div className="px-2 sm:px-4 pb-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="bg-primary-50 rounded-lg p-3 border border-primary-200">
          <p className="text-xs sm:text-sm text-primary-700 font-medium">System Status</p>
          <p className="text-xs text-primary-600 mt-1">All sensors operational</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;