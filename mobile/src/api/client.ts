import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.hyyyume.my.id/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const authAPI = {
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  register: (userData: Record<string, unknown>) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile')
};

export const dataAPI = {
  getLatestData: () => api.get('/data/latest'),
  getHistory: () => api.get('/data/history'),
  getHourlyData: (date: string) => api.get(`/data/hourly?date=${date}`)
};

export const pumpAPI = {
  controlPump: (status: 'on' | 'off') => api.post('/data/control-pump', { status })
};

export const subscriptionAPI = {
  createInvoice: (planId: string) => api.post('/subscription/create-invoice', { planId }),
  getStatus: () => api.get('/subscription/status')
};

export const plantAPI = {
  getAllPlantProfiles: (params?: any) => api.get('/plants', { params }),
  getPlantProfileById: (id: number) => api.get(`/plants/${id}`),
  getUserPlantSettings: (userId: number) => api.get(`/plants/user/${userId}/plants`),
  addUserPlant: (userId: number, plantData: any) => api.post(`/plants/user/${userId}/plants`, plantData),
  updateUserPlant: (userId: number, userPlantSettingId: number, plantData: any) => api.put(`/plants/user/${userId}/plants/${userPlantSettingId}`, plantData),
  removeUserPlant: (userId: number, userPlantSettingId: number) => api.delete(`/plants/user/${userId}/plants/${userPlantSettingId}`),
  getUserPlantOptimalParameters: (userId: number) => api.get(`/plants/user/${userId}/optimal-parameters`)
};

export const alertAPI = {
  getUserAlerts: (userId: number, params?: any) => api.get(`/alerts/user/${userId}`, { params }),
  getActiveAlerts: (userId: number) => api.get(`/alerts/user/${userId}/active`),
  resolveAlert: (userId: number, alertId: number) => api.put(`/alerts/user/${userId}/${alertId}/resolve`)
};

export const recommendationAPI = {
  getGrowthRecommendations: (userId: number) => api.get(`/recommendations/user/${userId}`)
};

export const userPreferencesAPI = {
  getUserPreferences: (userId: number) => api.get(`/users/${userId}/preferences`),
  updateUserPreferences: (userId: number, preferences: any) => api.put(`/users/${userId}/preferences`, preferences)
};



