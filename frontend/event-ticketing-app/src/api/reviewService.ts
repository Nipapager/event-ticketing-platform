import api from './axios';

export interface ReviewDTO {
  id: number;
  userId: number;
  userName: string;
  eventId: number;
  eventName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummaryDTO {
  averageRating: number;
  totalReviews: number;
}

export interface CreateReviewRequest {
  eventId: number;
  rating: number;
  comment?: string;
}

const reviewService = {
  // Create review
  createReview: async (request: CreateReviewRequest): Promise<ReviewDTO> => {
    const response = await api.post('/reviews', request);
    return response.data.data;
  },

  // Update review
  updateReview: async (reviewId: number, request: CreateReviewRequest): Promise<ReviewDTO> => {
    const response = await api.put(`/reviews/${reviewId}`, request);
    return response.data.data;
  },

  // Get reviews for an event
  getEventReviews: async (eventId: number): Promise<ReviewDTO[]> => {
    const response = await api.get(`/reviews/event/${eventId}`);
    return response.data.data;
  },

  // Get review summary for an event
  getReviewSummary: async (eventId: number): Promise<ReviewSummaryDTO> => {
    const response = await api.get(`/reviews/event/${eventId}/summary`);
    return response.data.data;
  },

  // Get current user's review for an event
  getUserReviewForEvent: async (eventId: number): Promise<ReviewDTO | null> => {
    const response = await api.get(`/reviews/event/${eventId}/my-review`);
    return response.data.data;
  },

  // Get all my reviews
  getMyReviews: async (): Promise<ReviewDTO[]> => {
    const response = await api.get('/reviews/my-reviews');
    return response.data.data;
  },

  // Delete review
  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};

export default reviewService;