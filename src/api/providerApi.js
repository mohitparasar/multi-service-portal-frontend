import api from './axiosInstance'
export const providerApi = {
  search: (params) => api.get('/api/providers/search', { params }),
  getById: (providerId) => api.get(`/api/providers/getProviderById/${providerId}`),
  getMyProfile: () => api.get('/api/providers/profile/getProfile'),
  createProfile: (payload) => api.post('/api/providers/profile/createProfile', payload),
  updateProfile: (payload) => api.put('/api/providers/profile/updateProfile', payload),

  getCategories: () => api.get('/api/providers/service-categories'),

  getSkills: () => api.get('/api/providers/skills'),
  createSkill: (payload) => api.post('/api/providers/skills', payload),
  updateSkill: (skillId, payload) => api.put(`/api/providers/skills/${skillId}`, payload),
  deleteSkill: (skillId) => api.delete(`/api/providers/skills/${skillId}`),

  getAddresses: () => api.get('/api/providers/addresses'),
  createAddress: (payload) => api.post('/api/providers/addresses', payload),
  updateAddress: (addressId, payload) => api.put(`/api/providers/addresses/${addressId}`, payload),
  deleteAddress: (addressId) => api.delete(`/api/providers/addresses/${addressId}`),

  getDocuments: () => api.get('/api/providers/documents'),
  uploadDocument: (documentType, file) => {
    const formData = new FormData()
    formData.append('documentType', documentType)
    formData.append('file', file)
    return api.post('/api/providers/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateDocument: (documentId, documentType, file) => {
    const formData = new FormData()
    formData.append('documentType', documentType)
    if (file) formData.append('file', file)
    return api.put(`/api/providers/documents/${documentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteDocument: (documentId) => api.delete(`/api/providers/documents/${documentId}`)
}
