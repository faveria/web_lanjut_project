import axios from 'axios';

// Define base URL - in development you can set a local backend, otherwise use production
// To use local backend, make sure to also run the backend server
let API_BASE_URL = 'https://api.hyyyume.my.id/api'; // Default to production

// Check if we're using a local backend (you can set this in a .env file)
if (import.meta.env?.VITE_API_BASE_URL) {
  API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
} else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // If accessing from localhost, try local backend first
  API_BASE_URL = 'http://localhost:3000/api';
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const dataAPI = {
  getLatestData: () => api.get('/data/latest'),
  getHistory: () => api.get('/data/history'),
};

export const subscriptionAPI = {
  createInvoice: (planId) => api.post('/subscription/create-invoice', { planId }),
  getStatus: () => api.get('/subscription/status'),
};

export const pumpAPI = {
  controlPump: (status) => api.post('/data/control-pump', { status }),
};

export default api;
