import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: AlertCircle,
};

export const Toast = ({ toast, onClose }) => {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center w-full max-w-sm p-4 mb-2 rounded-lg shadow-lg ${
        toast.type === 'success' ? 'bg-green-50 border border-green-200' :
        toast.type === 'error' ? 'bg-red-50 border border-red-200' :
        toast.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-blue-50 border border-blue-200'
      }`}
    >
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
        toast.type === 'success' ? 'text-green-500 bg-green-100' :
        toast.type === 'error' ? 'text-red-500 bg-red-100' :
        toast.type === 'warning' ? 'text-yellow-500 bg-yellow-100' :
        'text-blue-500 bg-blue-100'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-normal flex-1">{toast.message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
        onClick={() => onClose(toast.id)}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};