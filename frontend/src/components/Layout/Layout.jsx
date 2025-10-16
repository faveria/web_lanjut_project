import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false on mobile
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Separate state for mobile
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Add event listener to close mobile sidebar
  useEffect(() => {
    const handleCloseMobileSidebar = () => {
      setMobileSidebarOpen(false);
    };

    window.addEventListener('closeMobileSidebar', handleCloseMobileSidebar);

    return () => {
      window.removeEventListener('closeMobileSidebar', handleCloseMobileSidebar);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col h-screen">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - hidden on mobile unless explicitly opened */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out hidden lg:block overflow-hidden flex-shrink-0 h-full`}>
          <div className="h-full flex-1">
            <Sidebar currentPath={location.pathname} onNavigate={navigate} />
          </div>
        </div>
        
        {/* Mobile Sidebar - overlay style */}
        <div className={`fixed inset-0 z-40 lg:hidden ${mobileSidebarOpen ? 'block' : 'hidden'}`}>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className={`relative z-50 w-64 h-full bg-white max-w-[80%] transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar currentPath={location.pathname} onNavigate={navigate} />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 w-full overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;