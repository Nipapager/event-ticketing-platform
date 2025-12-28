import api from './axios';
import type { User } from '../types';

const userService = {

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update current user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

};

export default userService;