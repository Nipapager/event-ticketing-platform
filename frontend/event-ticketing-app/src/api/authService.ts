import api from './axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

// Authentication Service
const authService = {
  
  // Login function
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;  // ← Return ONLY the LoginResponse
  },

  // Register function
  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', userData);
  },

};

export default authService;