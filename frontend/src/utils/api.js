import axios from 'axios';

// Production API for authentication
const PRODUCTION_API_BASE_URL = 'https://api.hyyyume.my.id/api';

// VPS API for data operations (including pump control)
const VPS_API_BASE_URL = 'https://hyyyume.my.id:3000/api';

// API instance for authentication (always uses production)
const authApi = axios.create({
  baseURL: PRODUCTION_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API instance for data operations (uses VPS)
const dataApi = axios.create({
  baseURL: VPS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common interceptor for both APIs
const addAuthHeader = (apiInstance) => {
  apiInstance.interceptors.request.use(
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
};

// Add auth headers to both APIs
addAuthHeader(authApi);
addAuthHeader(dataApi);

// Response interceptor for handling 401 errors
const handle401Response = (apiInstance) => {
  apiInstance.interceptors.response.use(
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
};

// Add response interceptors to both APIs
handle401Response(authApi);
handle401Response(dataApi);

export const authAPI = {
  login: (credentials) => authApi.post('/auth/login', credentials),
  register: (userData) => authApi.post('/auth/register', userData),
  getProfile: () => authApi.get('/auth/profile'),
};

export const dataAPI = {
  getLatestData: () => dataApi.get('/data/latest'),
  getHistory: () => dataApi.get('/data/history'),
};

export const subscriptionAPI = {
  createInvoice: (planId) => authApi.post('/subscription/create-invoice', { planId }),
  getStatus: () => authApi.get('/subscription/status'),
};

export const pumpAPI = {
  controlPump: (status) => dataApi.post('/data/control-pump', { status }),
};

export default dataApi; // Default to data API for general use
