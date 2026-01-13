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
  const [allPastOrders, setAllPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ id: number; title: string } | null>(null);
  const [userReviews, setUserReviews] = useState<Map<number, ReviewDTO>>(new Map());
  const [activeTab, setActiveTab] = useState<'not-reviewed' | 'reviewed'>('not-reviewed');

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
        return eventDate < today && (order.status === 'COMPLETED' || order.status === 'CONFIRMED');
      });

      // Sort by event date (most recent first)
      const sorted = past.sort((a, b) => 
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      );

      setAllPastOrders(sorted);

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

  // Separate orders into reviewed and not reviewed
  const notReviewedOrders = allPastOrders.filter(order => !userReviews.has(order.eventId));
  const reviewedOrders = allPastOrders.filter(order => userReviews.has(order.eventId));

  const displayedOrders = activeTab === 'not-reviewed' ? notReviewedOrders : reviewedOrders;

  const handleRateEvent = (eventId: number, eventTitle: string) => {
    setSelectedEvent({ id: eventId, title: eventTitle });
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    fetchPastEvents(); // Refresh to get updated reviews
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <p className="text-gray-600">
            {allPastOrders.length} {allPastOrders.length === 1 ? 'event' : 'events'} attended
          </p>
        </div>

        {/* No past events state */}
        {allPastOrders.length === 0 ? (
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
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('not-reviewed')}
                    className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                      activeTab === 'not-reviewed'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Not Reviewed
                    {notReviewedOrders.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        {notReviewedOrders.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('reviewed')}
                    className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                      activeTab === 'reviewed'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Reviewed
                    {reviewedOrders.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {reviewedOrders.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Events List */}
            {displayedOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'not-reviewed' ? (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {activeTab === 'not-reviewed' ? 'All caught up!' : 'No reviews yet'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'not-reviewed' 
                    ? "You've reviewed all your past events" 
                    : "You haven't reviewed any events yet"
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {displayedOrders.map(order => {
                  const userReview = userReviews.get(order.eventId);
                  
                  return (
                    <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{order.eventTitle}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(order.eventDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} ticket{order.orderItems.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
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
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-green-800">✓ Your Review</p>
                              <StarRating rating={userReview.rating} size="sm" />
                            </div>
                            {userReview.comment && (
                              <p className="text-sm text-gray-700 mt-2">"{userReview.comment}"</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Reviewed on {formatDate(userReview.createdAt)}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <p className="text-sm text-yellow-800 font-medium">
                                You haven't reviewed this event yet
                              </p>
                            </div>
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
          </>
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