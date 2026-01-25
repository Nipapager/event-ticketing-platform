import api from './axios';
import type { User } from '../types';

const userService = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (userData: {
    name: string;
    phoneNumber?: string;
    address?: string;
  }): Promise<User> => {
    const response = await api.put('/users/profile', userData);
    return response.data.data;
  },

  // === ADMIN FUNCTIONS ===
  
  // Get all users (Admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.data;
  },

  // Update user roles (Admin only)
  updateUserRoles: async (userId: number, roles: string[]): Promise<User> => {
    const response = await api.put(`/users/${userId}/roles`, { roles });
    return response.data.data;
  },
};

export default userService;