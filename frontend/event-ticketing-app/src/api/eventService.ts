import api from './axios';
import type { Event } from '../types';

const eventService = {
  // Get all approved events
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data.data;
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

  // === ORGANIZER FUNCTIONS ===

  // Create new event (Organizer/Admin)
  createEvent: async (eventData: {
    title: string;
    description: string;
    categoryId: number;
    venueId: number;
    eventDate: string;
    eventTime: string;
    imageUrl?: string;
  }): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data.data;
  },

  // Get organizer's events
  getMyEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/my-events');
    return response.data.data;
  },

  // Update event
  updateEvent: async (id: number, eventData: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data.data;
  },

  // Delete event (soft delete - cancel)
  deleteEvent: async (id: number): Promise<void> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // === ADMIN FUNCTIONS ===

  // Approve event (Admin only)
  approveEvent: async (id: number): Promise<Event> => {
    const response = await api.put(`/events/${id}/approve`);
    return response.data.data;
  },

  // Reject event (Admin only)
  rejectEvent: async (id: number): Promise<Event> => {
    const response = await api.put(`/events/${id}/reject`);
    return response.data.data;
  },
};

export default eventService;