import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register(formData.email, formData.password);
      
      if (result.success) {
        // Success animation before navigation
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { id: 1, text: 'At least 6 characters', met: formData.password.length >= 6 },
    { id: 2, text: 'Contains letters and numbers', met: /[a-zA-Z]/.test(formData.password) && /[0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center space-x-3"
            >
              <img
                src="/favicon.png"
                alt="HY.YUME Logo"
                className="w-12 h-12 object-contain"
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HY.YUME</h1>
              <p className="text-primary-600 dark:text-primary-400 font-semibold">Monitor</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-300">Join our smart hydroponic monitoring system</p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border dark:border-gray-700">
            <CardHeader className="text-center space-y-2 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Start Your Journey
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 pr-4 py-3 border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 py-3 border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 py-3 border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Password Requirements:</p>
                    {passwordRequirements.map((req) => (
                      <div key={req.id} className="flex items-center space-x-2">
                        {req.met ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800"
                  >
                    <p className="text-red-700 text-sm text-center dark:text-red-300">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Terms and Conditions */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm dark:text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 text-center dark:text-white">Why Join HY.YUME?</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: '📊', text: 'Real-time sensor monitoring' },
              { icon: '📈', text: 'Historical data analytics' },
              { icon: '🔔', text: 'Smart alert system' },
              { icon: '🌱', text: 'Optimized hydroponic growth' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <span className="text-xl">{benefit.icon}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 HY.YUME Monitor. Secure hydroponic monitoring system.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;