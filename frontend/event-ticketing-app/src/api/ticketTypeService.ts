import api from './axios';

interface TicketType {
  id: number;
  eventId: number;
  eventName: string;
  name: string;
  price: number;
  totalQuantity: number;
  quantityAvailable: number;
  createdAt: string;
  updatedAt: string;
}

const ticketTypeService = {
  // Create ticket type for event
  createTicketType: async (eventId: number, ticketData: {
    name: string;
    price: number;
    totalQuantity: number;
  }): Promise<TicketType> => {
    const response = await api.post(`/ticket-types/event/${eventId}`, ticketData);
    return response.data.data;
  },

  // Get ticket types for event
  getTicketTypesByEvent: async (eventId: number): Promise<TicketType[]> => {
    const response = await api.get(`/ticket-types/event/${eventId}`);
    return response.data.data;
  },

  // Update ticket type
  updateTicketType: async (id: number, ticketData: {
    name?: string;
    price?: number;
    quantityAvailable?: number;
  }): Promise<TicketType> => {
    const response = await api.put(`/ticket-types/${id}`, ticketData);
    return response.data.data;
  },

  // Delete ticket type
  deleteTicketType: async (id: number): Promise<void> => {
    const response = await api.delete(`/ticket-types/${id}`);
    return response.data;
  }
};

export default ticketTypeService;