import api from './axios';
import type { Event } from '../types';

const eventService = {
  
  // Get all approved events
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data.data;  // Response wrapper: { statusCode, message, data }
  },

  // Get event by ID
  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  // Search events with filters
  searchEvents: async (params: {
    search?: string;
    city?: string;
    categoryId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Event[]> => {
    const response = await api.get('/events/search', { params });
    return response.data.data;
  },

};

export default eventService;