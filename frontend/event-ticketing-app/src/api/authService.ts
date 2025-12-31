import api from './axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

// Authentication Service
const authService = {
  
  // Login function
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    const data = response.data.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },
  
  // Register function
  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', userData);
  },
  
  // Logout - clear localStorage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

export default authService;