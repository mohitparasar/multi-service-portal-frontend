import api from "./axiosInstance";

export const userApi = {
 // Dashboard
getDashboard: () =>
  api.get("/api/users/dashboard"),

// Profile
getProfile: () =>
  api.get("/api/users/profile"),

createProfile: (payload) =>
  api.post("/api/users/profile", payload),

updateProfile: (payload) =>
  api.put("/api/users/profile", payload),

// Addresses
getAddresses: () =>
  api.get("/api/users/address"),

addAddress: (addressData) =>
  api.post("/api/users/address", addressData),

getAddressById: (addressId) =>
  api.get(`/api/users/address/${addressId}`),

updateAddress: (addressId, addressData) =>
  api.put(
    `/api/users/address/${addressId}`,
    addressData
  ),

deleteAddress: (addressId) =>
  api.delete(
    `/api/users/address/${addressId}`
  ),

makeDefaultAddress: (addressId) =>
  api.put(
    `/api/users/address/${addressId}/default`
  ),
// Favorites
getFavorites: () =>
  api.get("/api/users/favorites"),

addFavorite: (providerId) =>
  api.post(`/api/users/favorites/${providerId}`),

removeFavorite: (providerId) =>
  api.delete(`/api/users/favorites/${providerId}`),
};