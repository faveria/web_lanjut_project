import React from 'react';
import { useNavigate } from 'react-router-dom';

const MobileNotSupported = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20">
            <svg 
              className="w-8 h-8 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Mobile Access Not Supported</h1>
        
        <p className="text-gray-300 mb-6">
          Please access this website from a desktop computer for the best experience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            This site is optimized for desktop use. We're working on a mobile version that will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileNotSupported;