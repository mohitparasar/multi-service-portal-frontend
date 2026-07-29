import api from './axiosInstance'
export const userApi = {
  getMyProfile: () => api.get('/api/users/me'),
  createProfile: (payload) => api.post('/api/users/profile', payload),
  updateProfile: (payload) => api.put('/api/users/profile', payload),
  getDashboard: () => api.get('/api/users/dashboard')
}
