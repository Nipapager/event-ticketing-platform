import apiClient from './axios';
import type { Order, User } from '../types';

const adminService = {
  // Get all orders
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/admin/orders');
    return response.data.data;
  },

  // Refund order
  refundOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.put(`/admin/orders/${id}/refund`);
    return response.data.data;
  },

  // Get all users (Admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data.data;
  }
};

export default adminService;