import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', withCredentials: true, headers: { 'Content-Type': 'application/json' } })
export const setAccessToken = (token) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}
export default api
