import apiClient from './axios';

export interface CheckoutRequest {
  eventId: number;
  items: {
    ticketTypeId: number;
    quantity: number;
  }[];
}

export interface CheckoutResponse {
  sessionId: string;
  sessionUrl: string;
  orderId: number;
}

const paymentService = {
  // Create Stripe checkout session
  createCheckoutSession: async (request: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await apiClient.post('/payments/create-checkout-session', request);
    return response.data.data;
  },

  // Verify payment session (optional)
  verifySession: async (sessionId: string): Promise<void> => {
    await apiClient.get(`/payments/verify-session/${sessionId}`);
  },
};

export default paymentService;