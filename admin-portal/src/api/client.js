import axios from 'axios'

// Central axios instance. Once the backend is ready, every real request
// should go through this so the JWT is attached automatically.
const client = axios.create({
  baseURL: '/api', // with the Vite proxy (see vite.config.js) this hits Spring Boot
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT (saved at login) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token is expired/invalid, kick the user back to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
