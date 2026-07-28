import api from './axiosInstance'
export const authApi = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  refresh: () => api.post('/api/auth/refresh'),
  logout: () => api.post('/api/auth/logout')
}
