import api from "./axiosInstance";

export const bookingApi = {
  // =========================
  // Customer Booking APIs
  // =========================

  create: (payload) =>
    api.post("/api/bookings", payload),

  getById: (bookingId) =>
    api.get(`/api/bookings/${bookingId}`),

  getCustomerBookings: () =>
    api.get("/api/bookings/my"),

  cancel: (bookingId, payload) =>
    api.put(
      `/api/bookings/${bookingId}/cancel`,
      payload
    ),


  reschedule: (bookingId, payload) =>
    api.put(`/api/bookings/${bookingId}/reschedule`, payload),

  updatePayment: (bookingId, paymentStatus) =>
    api.put(`/api/bookings/${bookingId}/payment`, {
      paymentStatus,
    }),

  // =========================
  // Provider Booking APIs
  // =========================

  getProviderBookings: () =>
    api.get("/api/provider/bookings"),

  getPendingBookings: () =>
    api.get("/api/provider/bookings/pending"),

  acceptBooking: (bookingId) =>
    api.put(`/api/provider/bookings/${bookingId}/accept`),

  rejectBooking: (bookingId, payload) =>
    api.put(`/api/provider/bookings/${bookingId}/reject`, payload),

  startBooking: (bookingId) =>
    api.put(`/api/provider/bookings/${bookingId}/start`),

  completeBooking: (bookingId) =>
    api.put(`/api/provider/bookings/${bookingId}/complete`),
};