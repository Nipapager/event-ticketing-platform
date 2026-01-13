import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../../api/eventService';
import type { Event } from '../../types';

interface OrganizerPastEventsProps {
  organizerId: number;
  currentEventId: number;
  organizerName: string;
}

const OrganizerPastEvents = ({ organizerId, currentEventId, organizerName }: OrganizerPastEventsProps) => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizerPastEvents();
  }, [organizerId]);

  const fetchOrganizerPastEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await eventService.getAllEvents();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter: same organizer, past events, not current event, approved status
      const filtered = allEvents.filter(event => {
        const eventDate = new Date(event.eventDate);
        eventDate.setHours(0, 0, 0, 0);
        
        return (
          event.organizerId === organizerId &&
          event.id !== currentEventId &&
          eventDate < today &&
          event.status === 'APPROVED'
        );
      });

      // Sort by date (most recent first)
      const sorted = filtered.sort((a, b) => 
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      );

      // Take only first 6 events
      setPastEvents(sorted.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch organizer past events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Don't render if no past events
  if (!loading && pastEvents.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Past Events by {organizerName}
        </h2>
        <div className="text-center py-8 text-gray-500">
          Loading past events...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Past Events by {organizerName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          >
            {/* Event Image */}
            <div className="relative h-40 bg-gray-200 overflow-hidden">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                  <span className="text-white text-3xl">🎉</span>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
              
              {/* Date */}
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(event.eventDate)}</span>
              </div>

              {/* Rating */}
              <div className="mb-3">
                {event.averageRating && event.averageRating > 0 ? (
                  <div className="flex items-center gap-2">
                    {renderStars(event.averageRating)}
                    <span className="text-sm font-semibold text-gray-700">
                      {event.averageRating.toFixed(1)}
                    </span>
                    {event.reviewCount !== undefined && event.reviewCount > 0 && (
                      <span className="text-xs text-gray-500">
                        ({event.reviewCount} {event.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-gray-300 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">No reviews yet</span>
                  </div>
                )}
              </div>

              {/* Price */}
              {event.ticketTypes && event.ticketTypes.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">From</span>
                    <span className="text-sm font-bold text-blue-600">
                      €{Math.min(...event.ticketTypes.map(t => t.price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {pastEvents.length >= 6 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Showing {pastEvents.length} most recent past events
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizerPastEvents;