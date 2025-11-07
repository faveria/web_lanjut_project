import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setError('Invalid verification link. Missing required parameters.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/api/auth/verify-email?token=${token}&email=${email}`
        );

        if (response.data.success) {
          setSuccess(true);
          setMessage(response.data.message);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.response?.data?.message || 'An error occurred during verification');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800"
      >
        <div className="text-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <RotateCcw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Verifying your email...</h2>
              <p className="text-gray-600 dark:text-gray-300">Please wait while we verify your email address</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Email Verified!</h2>
              <p className="text-gray-600 text-center mb-6 dark:text-gray-300">
                {message || 'Your email has been successfully verified. You can now log in to your account.'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Verification Failed</h2>
              <p className="text-gray-600 text-center mb-6 dark:text-gray-300">
                {error || 'An error occurred during email verification. Please try again.'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;