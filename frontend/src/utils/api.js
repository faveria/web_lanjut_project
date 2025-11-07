import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.example.com/api';

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
  getHourlyData: (date) => api.get(`/data/hourly?date=${date}`),
};

export const subscriptionAPI = {
  createInvoice: (planId) => api.post('/subscription/create-invoice', { planId }),
  getStatus: () => api.get('/subscription/status'),
};

export const plantAPI = {
  getAllPlantProfiles: (params) => api.get('/plants', { params }),
  getPlantProfileById: (id) => api.get(`/plants/${id}`),
  getUserPlantSettings: (userId) => api.get(`/plants/user/${userId}/plants`),
  addUserPlant: (userId, plantData) => api.post(`/plants/user/${userId}/plants`, plantData),
  updateUserPlant: (userId, userPlantSettingId, plantData) => api.put(`/plants/user/${userId}/plants/${userPlantSettingId}`, plantData),
  removeUserPlant: (userId, userPlantSettingId) => api.delete(`/plants/user/${userId}/plants/${userPlantSettingId}`),
  getUserPlantOptimalParameters: (userId) => api.get(`/plants/user/${userId}/optimal-parameters`),
};

export const alertAPI = {
  getUserAlerts: (userId, params) => api.get(`/alerts/user/${userId}`, { params }),
  getActiveAlerts: (userId) => api.get(`/alerts/user/${userId}/active`),
  resolveAlert: (userId, alertId) => api.put(`/alerts/user/${userId}/${alertId}/resolve`),
};

export const recommendationAPI = {
  getGrowthRecommendations: (userId) => api.get(`/recommendations/user/${userId}`),
};

export const pumpAPI = {
  controlPump: (status) => api.post('/data/control-pump', { status }),
};

export default api;
