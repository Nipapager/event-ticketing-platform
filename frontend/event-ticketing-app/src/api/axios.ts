import axios from 'axios';

// Base URL του Spring Boot backend
const BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to every request (if exists)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if the endpoint is public (events, categories, venues)
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      
      // List of public endpoints that don't require authentication
      const publicEndpoints = [
        '/auth/',
        '/events',
        '/categories',
        '/venues',
        '/reviews/event',
      ];
      
      // Check if this is a public endpoint
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        requestUrl.includes(endpoint)
      );
      
      // Only redirect to login if it's NOT a public endpoint
      if (!isPublicEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;