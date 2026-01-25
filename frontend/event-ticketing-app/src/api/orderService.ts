import apiClient from './axios';
import type { Order, OrderRequest } from '../types';

const orderService = {
  // Create new order
  createOrder: async (orderRequest: OrderRequest): Promise<Order> => {
    const response = await apiClient.post('/orders', orderRequest);
    return response.data.data;
  },

  // Get my orders
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data.data;
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data.data;
  },

  // Get order by session ID
  getOrderBySessionId: async (sessionId: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/session/${sessionId}`);
    return response.data.data;
  },

  // Confirm order (payment simulation)
  confirmOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}/confirm`);
    return response.data.data;
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}/cancel`);
    return response.data.data;
  },

  // === ADMIN FUNCTIONS ===
  
  // Get all orders (Admin only)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data.data;
  },

  // === ORGANIZER FUNCTIONS ===
  
  // Get orders by event ID (Organizer/Admin)
  getOrdersByEventId: async (eventId: number): Promise<Order[]> => {
    const response = await apiClient.get(`/orders/event/${eventId}`);
    return response.data.data;
  },
};

export default orderService;