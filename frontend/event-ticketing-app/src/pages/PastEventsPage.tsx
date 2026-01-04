import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../api/orderService';
import reviewService from '../api/reviewService';
import type { Order } from '../types';
import type { ReviewDTO } from '../api/reviewService';
import authService from '../api/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReviewModal from '../components/reviews/ReviewModal';
import StarRating from '../components/common/StarRating';

const PastEventsPage = () => {
  const navigate = useNavigate();
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ id: number; title: string } | null>(null);
  const [userReviews, setUserReviews] = useState<Map<number, ReviewDTO>>(new Map());

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      
      // Filter past events (event date has passed)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const past = data.filter(order => {
        const eventDate = new Date(order.eventDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today && order.status === 'COMPLETED';
      });

      setPastOrders(past);

      // Fetch reviews for past events
      await fetchUserReviews();
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load past events');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const reviews = await reviewService.getMyReviews();
      const reviewMap = new Map<number, ReviewDTO>();
      reviews.forEach(review => {
        reviewMap.set(review.eventId, review);
      });
      setUserReviews(reviewMap);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleRateEvent = (eventId: number, eventTitle: string) => {
    setSelectedEvent({ id: eventId, title: eventTitle });
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    fetchPastEvents(); // Refresh to get updated reviews
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading past events..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Past Events</h1>
          <p className="text-gray-600">Events you've attended</p>
        </div>

        {/* Events List */}
        {pastOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No past events</h3>
            <p className="text-gray-600 mb-6">You haven't attended any events yet</p>
            <button
              onClick={() => navigate('/events')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {pastOrders.map(order => {
              const userReview = userReviews.get(order.eventId);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{order.eventTitle}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(order.eventDate).toLocaleDateString('en-GB')}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            {order.orderItems.length} ticket{order.orderItems.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                        <p className="text-lg font-bold text-gray-800">€{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Ticket Items */}
                    <div className="mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        {order.orderItems.map((item, index) => (
                          <div key={item.id} className={`flex justify-between text-sm ${index > 0 ? 'mt-2 pt-2 border-t' : ''}`}>
                            <span className="text-gray-700">{item.quantity}x {item.ticketTypeName}</span>
                            <span className="font-medium text-gray-800">€{(item.quantity * item.pricePerTicket).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Section */}
                    {userReview ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-700">Your Review</p>
                          <StarRating rating={userReview.rating} size="sm" />
                        </div>
                        {userReview.comment && (
                          <p className="text-sm text-gray-700 italic">"{userReview.comment}"</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-800">
                          ⭐ You haven't reviewed this event yet
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/events/${order.eventId}`)}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        View Event
                      </button>
                      <button
                        onClick={() => handleRateEvent(order.eventId, order.eventTitle)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {userReview ? 'Update Review' : 'Rate Event'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedEvent && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          existingReview={userReviews.get(selectedEvent.id) || null}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default PastEventsPage;