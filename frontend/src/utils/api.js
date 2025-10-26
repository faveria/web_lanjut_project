import axios from 'axios';

// Use local backend in development, production server in production
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : 'https://api.hyyyume.my.id/api';

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
