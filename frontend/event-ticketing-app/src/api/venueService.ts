import api from './axios';
import type { Venue } from '../types';

const venueService = {
  // Get all venues
  getAllVenues: async (): Promise<Venue[]> => {
    const response = await api.get('/venues');
    return response.data.data;
  },

  // Get venue by ID
  getVenueById: async (id: number): Promise<Venue> => {
    const response = await api.get(`/venues/${id}`);
    return response.data.data;
  }
};

export default venueService;