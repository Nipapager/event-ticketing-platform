import apiClient from './axios';
import type { Order } from '../types';

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
};

export default adminService;