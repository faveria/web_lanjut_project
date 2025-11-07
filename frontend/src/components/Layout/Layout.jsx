import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Activity, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

// Animated particles effect for background
const AnimatedParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-primary-300/30 to-green-300/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.3 + 0.1
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Mobile sidebar component with consistent styling
const MobileSidebar = ({ isOpen, onClose, currentPath, onNavigate }) => {
  const { logout, user } = useAuth();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Activity, label: 'Daily History', path: '/daily-history' },
    { icon: CreditCard, label: 'Subscription', path: '/subscription' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (path) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ 
          type: 'spring', 
          damping: 18, 
          stiffness: 100,
          duration: 0.4,
          ease: 'easeInOut'
        }}
        className="relative z-50 w-64 h-full bg-gradient-to-b from-slate-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 shadow-xl"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div></div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 80, damping: 12 }}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 text-left',
                  'mb-1',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-blue-500/10 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500'
                    : 'text-gray-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  isActive ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
                )} />
                <span className={`font-medium ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-200/30 dark:border-gray-700 mt-auto">
          <div className="bg-gradient-to-r from-red-50 to-red-100/30 p-3 rounded-lg border border-red-200 dark:from-red-900/30 dark:to-red-900/10 dark:border-red-800/50">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-all duration-200 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Desktop sidebar with consistent styling
const DesktopSidebar = ({ isOpen, currentPath, onNavigate }) => {
  const { logout } = useAuth();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Activity, label: 'Daily History', path: '/daily-history' },
    { icon: CreditCard, label: 'Subscription', path: '/subscription' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? '256px' : '80px' }}
      transition={{ 
        type: 'spring', 
        damping: 18, 
        stiffness: 120,
        duration: 0.4,
        ease: 'easeInOut'
      }}
      className="bg-gradient-to-b from-slate-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:flex flex-col h-full flex-shrink-0 overflow-hidden relative"
    >
      <div className="p-3">
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 80, damping: 12 }}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 text-left mb-1',
                isActive
                  ? 'bg-gradient-to-r from-primary-500/10 to-blue-500/10 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500'
                  : 'text-gray-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
              )}
            >
              <Icon className={cn(
                'w-5 h-5',
                isActive ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
              )} />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`font-medium ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-200/30 dark:border-gray-700">
        <div className="bg-gradient-to-r from-red-50 to-red-100/30 p-3 rounded-lg border border-red-200 dark:from-red-900/30 dark:to-red-900/10 dark:border-red-800/50">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center lg:justify-start space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-left mb-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Layout Component
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 relative overflow-hidden">
      {/* Animated particles background */}
      <AnimatedParticles />
      
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-3 shadow-sm sm:px-6 sm:py-4 border-b border-primary-200/30 dark:border-gray-700 z-40"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="p-2 lg:hidden border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            
            {/* Desktop toggle button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="p-2 hidden lg:flex border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30"
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
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] dark:text-white">{useAuth().user?.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex h-screen pt-16 relative z-10">
        {/* Desktop Sidebar - now fixed position below header */}
        <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] z-30">
          <DesktopSidebar 
            isOpen={sidebarOpen} 
            currentPath={location.pathname} 
            onNavigate={navigate} 
          />
        </div>
        
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={mobileSidebarOpen} 
          onClose={() => setMobileSidebarOpen(false)} 
          currentPath={location.pathname} 
          onNavigate={navigate} 
        />
        
        {/* Main Content - adjust left margin based on sidebar state and remove extra top padding */}
        <main className={`flex-1 w-full overflow-auto p-4 sm:p-6 backdrop-blur-sm ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;