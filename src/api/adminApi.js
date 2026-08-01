import api from './axiosInstance'

export const adminApi = {
  getProvidersByStatus: (status = 'PENDING') => api.get(`/api/providers/status/${status}`),
  getPendingProviders: () => api.get('/api/providers/status/PENDING'),
  getProvider: (providerId) => api.get(`/api/providers/${providerId}`),
  approveProvider: (providerId) => api.put(`/api/providers/${providerId}/approve`),
  rejectProvider: (providerId) => api.put(`/api/providers/${providerId}/reject`),
  getDocumentsByStatus: (status = 'PENDING') => api.get(`/api/providers/provider-documents/status/${status}`),
  getDocument: (documentId) => api.get(`/api/providers/provider-documents/${documentId}`),
  approveDocument: (documentId) => api.put(`/api/providers/provider-documents/${documentId}/approve`),
  rejectDocument: (documentId, remarks = 'Image is not clear') => api.put(`/api/providers/provider-documents/${documentId}/reject`, { remarks }),
  getCategories: () => api.get('/api/providers/service-categories'),
  createCategory: (payload) => api.post('/api/providers/service-categories', payload),
  updateCategory: (categoryId, payload) => api.put(`/api/providers/service-categories/${categoryId}`, payload),
  deleteCategory: (categoryId) => api.delete(`/api/providers/service-categories/${categoryId}`),
  getBookings: () => api.get('/api/admin/bookings')
}
