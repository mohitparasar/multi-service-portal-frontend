import api from './axiosInstance'

export const adminApi = {
  getPendingProviders: () => api.get('/api/providers/admin/providers/pending'),
  approveProvider: (providerId) => api.put(`/api/providers/admin/providers/${providerId}/approve`),
  rejectProvider: (providerId) => api.put(`/api/providers/admin/providers/${providerId}/reject`),
  getDocumentsByStatus: (status = 'PENDING') => api.get(`/api/admin/provider-documents/status/${status}`),
  getDocument: (documentId) => api.get(`/api/admin/provider-documents/${documentId}`),
  approveDocument: (documentId, remarks = 'Verified Successfully') => api.put(`/api/admin/provider-documents/${documentId}/approve`, { remarks }),
  rejectDocument: (documentId, remarks = 'Image is not clear') => api.put(`/api/admin/provider-documents/${documentId}/reject`, { remarks })
}
