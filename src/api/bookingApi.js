import api from './axiosInstance'
export const bookingApi = {
  create: (payload) => api.post('/api/bookings', payload),
  getById: (bookingId) => api.get(`/api/bookings/${bookingId}`),
  getCustomerBookings: () => api.get('/api/bookings/customer'),
  getProviderBookings: () => api.get('/api/bookings/provider'),
  cancel: (bookingId, payload) => api.put(`/api/bookings/${bookingId}/cancel`, payload),
  reschedule: (bookingId, payload) => api.put(`/api/bookings/${bookingId}/reschedule`, payload),
  updateStatus: (bookingId, status) => api.put(`/api/bookings/${bookingId}/status`, { status }),
  updatePayment: (bookingId, paymentStatus) => api.put(`/api/bookings/${bookingId}/payment`, { paymentStatus })
}
