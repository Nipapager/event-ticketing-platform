import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import eventService from '../api/eventService';
import authService from '../api/authService';
import type { Event } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // confirmation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<{ id: number; title: string } | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const toMillis = (value: any) => {
    if (!value) return 0;

    // Handles LocalDateTime serialized as array: [yyyy, MM, dd, HH, mm, ss, nano]
    if (Array.isArray(value)) {
      const [y, m, d, h = 0, min = 0, s = 0, nano = 0] = value;
      const ms = Math.floor(nano / 1_000_000);
      return new Date(y, (m ?? 1) - 1, d ?? 1, h, min, s, ms).getTime();
    }

    const t = Date.parse(value);
    return Number.isNaN(t) ? 0 : t;
  };

  const sortByCreatedAtDesc = (list: Event[]) => {
    return [...list].sort((a, b) => {
      const aCreated = toMillis((a as any).createdAt) || toMillis((a as any).updatedAt) || 0;
      const bCreated = toMillis((b as any).createdAt) || toMillis((b as any).updatedAt) || 0;

      if (bCreated !== aCreated) return bCreated - aCreated;

      const aId = typeof a.id === 'number' ? a.id : 0;
      const bId = typeof b.id === 'number' ? b.id : 0;
      return bId - aId;
    });
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getMyEvents();
      setAllEvents(sortByCreatedAtDesc(data));
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Separate events into upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = allEvents.filter(event => {
    const eventDate = new Date(event.eventDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const pastEvents = allEvents.filter(event => {
    const eventDate = new Date(event.eventDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  });

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const filteredEvents = filter === 'ALL'
    ? displayEvents
    : displayEvents.filter(event => event.status === filter);

  // open/close modal
  const openCancelModal = (event: Event) => {
    setCancelTarget({ id: event.id as number, title: event.title });
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    if (cancelling) return;
    setCancelModalOpen(false);
    setCancelTarget(null);
  };

  // confirmed cancel action
  const confirmCancel = async () => {
    if (!cancelTarget) return;

    try {
      setCancelling(true);
      await eventService.deleteEvent(cancelTarget.id);
      toast.success('Event cancelled successfully');
      closeCancelModal();
      fetchMyEvents(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel event');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your events..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* ✅ Confirmation Modal */}
        {cancelModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeCancelModal}
            />

            {/* Panel */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-7.1 12.29A2 2 0 005 19h14a2 2 0 001.81-2.85l-7.1-12.29a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 id="cancel-title" className="text-xl font-bold text-gray-900">
                      Cancel this event?
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      You’re about to cancel{' '}
                      <span className="font-semibold text-gray-900">
                        {cancelTarget?.title}
                      </span>.
                      <br />
                      This will remove it from active listings and users won’t be able to buy tickets.
                    </p>

                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                      Tip: If you only need to change details, use <span className="font-semibold">Edit Event</span> instead.
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={closeCancelModal}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Keep Event
                </button>

                <button
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" />
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Event'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
            <p className="text-gray-600 mt-1">Manage your events and track their status</p>
          </div>
          <button
            onClick={() => navigate('/create-event')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab('upcoming');
                  setFilter('ALL');
                }}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'upcoming'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Upcoming Events
                {upcomingEvents.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {upcomingEvents.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('past');
                  setFilter('ALL');
                }}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'past'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Past Events
                {pastEvents.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {pastEvents.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
                {status === 'ALL' && ` (${displayEvents.length})`}
                {status !== 'ALL' && ` (${displayEvents.filter(e => e.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        {allEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">You haven't created any events yet</p>
            <button
              onClick={() => navigate('/create-event')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Your First Event
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {activeTab === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </h3>
            <p className="text-gray-600">
              {filter === 'ALL'
                ? (activeTab === 'upcoming'
                    ? "You don't have any upcoming events"
                    : "You don't have any past events")
                : `No ${filter.toLowerCase()} events in this category`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map(event => {
              const eventDate = new Date(event.eventDate);
              const isPast = eventDate < today;

              return (
                <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">

                    {/* Event Image */}
                    <div className="w-64 h-48 flex-shrink-0 relative">
                      <img
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {isPast && (
                        <div className="absolute top-2 right-2 bg-gray-800/90 text-white px-2 py-1 rounded text-xs font-semibold">
                          Past Event
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(event.eventDate).toLocaleDateString('en-GB')}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.eventTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.venueName}, {event.venueCity}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(event.status)}
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                      {/* Ticket Types Summary */}
                      {event.ticketTypes && event.ticketTypes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Ticket Types:</p>
                          <div className="flex flex-wrap gap-2">
                            {event.ticketTypes.map(ticket => (
                              <div key={ticket.id} className="bg-gray-50 px-3 py-1 rounded text-sm">
                                <span className="font-medium">{ticket.name}</span>
                                <span className="text-gray-600"> - €{ticket.price}</span>
                                <span className="text-gray-500"> ({ticket.quantityAvailable}/{ticket.totalQuantity})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          View Details
                        </button>

                        {!isPast && event.status !== 'CANCELLED' && (
                          <>
                            <button
                              onClick={() => navigate(`/edit-event/${event.id}`)}
                              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Edit Event
                            </button>
                            <button
                              onClick={() => openCancelModal(event)}
                              className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>

                      {/* Status Messages */}
                      {event.status === 'PENDING' && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            ⏳ Your event is awaiting admin approval
                          </p>
                        </div>
                      )}
                      {event.status === 'REJECTED' && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800">
                            ❌ This event was rejected by admin
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
