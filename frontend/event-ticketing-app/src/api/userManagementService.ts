import api from './axios';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

const userManagementService = {
  // Get all users (Admin only)
  getAllUsers: async (): Promise<UserDTO[]> => {
    const response = await api.get('/users');
    return response.data.data;
  },

  // Promote user to organizer (Admin only)
  promoteToOrganizer: async (userId: number): Promise<UserDTO> => {
    const response = await api.put(`/users/${userId}/promote-organizer`);
    return response.data.data;
  },

  // Demote organizer to user (Admin only)
  demoteFromOrganizer: async (userId: number): Promise<UserDTO> => {
    const response = await api.put(`/users/${userId}/demote-organizer`);
    return response.data.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId: number): Promise<void> => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userManagementService;