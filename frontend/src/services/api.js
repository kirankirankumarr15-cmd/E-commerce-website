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
  (response) => {
    // If Vercel SPA rewrite returned HTML for an API call, fallback to mock response
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE') ||
        response.data.includes('<!doctype') ||
        response.data.includes('<html'))
    ) {
      const config = response.config || {};
      let parsedData = {};
      try {
        parsedData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
      } catch {}
      return getMockResponse(config.url || '', config.params || {}, parsedData);
    }
    return response;
  },
  (error) => {
    // Graceful fallback for all network errors, 404s, and server errors
    const config = error.config || {};
    let parsedData = {};
    try {
      parsedData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    } catch {}
    const fallback = getMockResponse(config.url || '', config.params || {}, parsedData);
    return Promise.resolve(fallback);
  }
);

export default api;
