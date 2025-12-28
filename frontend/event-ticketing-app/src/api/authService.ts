import api from './axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

// Authentication service
const authService = {
  
  // Login function
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register function
  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', userData);
  },

};

export default authService;