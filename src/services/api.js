import axios from 'axios';

// Sécurité : garantit que l'URL de base se termine par /api
function normalizeApiUrl(url) {
  const fallback = 'https://btt-backend-sgas.onrender.com/api';
  if (!url) return fallback;
  let u = url.trim().replace(/\/+$/, '');
  if (!u.endsWith('/api')) u += '/api';
  return u;
}

const api = axios.create({
  baseURL: normalizeApiUrl(import.meta.env.VITE_API_URL),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;