import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/Auth/AuthForm';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Success animation before navigation
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@hyyume.com',
      password: 'demopassword'
    });
    
    setLoading(true);
    setError('');

    try {
      const result = await login('demo@hyyume.com', 'demopassword');
      
      if (result.success) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        // If demo account doesn't exist, show message
        setError('Demo account not available. Please register first.');
      }
    } catch (err) {
      setError('Demo login failed. Please register an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors group"
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
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              src="/favicon.png"
              alt="HY.YUME Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HY.YUME</h1>
              <p className="text-primary-600 font-semibold dark:text-primary-400">Monitor</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-300">Sign in to your hydroponic monitoring dashboard</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:text-white">
            <CardHeader className="text-center space-y-2 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Sign In to Your Account
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
                      className="pl-10 pr-4 py-3 border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 py-3 border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Login Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 font-medium dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  Try Demo Account
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2 dark:text-gray-400">
                  Experience the dashboard with sample data
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm dark:text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-green-900/20">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Real-time Data</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-blue-900/20">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Live Charts</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 dark:bg-purple-900/20">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Smart Alerts</p>
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

export default Login;