import api from './axiosInstance'
export const providerApi = {
  search: (params) => api.get('/api/providers/search', { params }),
  getMyProfile: () => api.get('/api/providers/profile/me'),
  createProfile: (payload) => api.post('/api/providers/profile', payload),
  getSkills: () => api.get('/api/providers/skills'),
  getDocuments: () => api.get('/api/providers/documents')
}
