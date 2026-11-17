import axios from 'axios';
import { getMockResponse } from './mockFallback';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nova_mart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns 404 or network error, serve graceful mock response so site never crashes
    const status = error.response?.status;
    if (status === 404 || !error.response) {
      const config = error.config || {};
      const fallback = getMockResponse(config.url || '', config.params || {});
      return Promise.resolve(fallback);
    }

    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
