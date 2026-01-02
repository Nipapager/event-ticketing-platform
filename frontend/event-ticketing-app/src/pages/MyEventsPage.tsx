import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import eventService from '../api/eventService';
import authService from '../api/authService';
import type { Event } from '../types';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchMyEvents();
  }, []);

  useEffect(() => {
    // Apply filter whenever events or filter changes
    applyFilter();
  }, [events, filter]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getMyEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === 'ALL') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.status === filter));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this event?')) return;

    try {
      await eventService.deleteEvent(id);
      toast.success('Event cancelled successfully');
      fetchMyEvents(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel event');
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
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
                {status === 'ALL' && ` (${events.length})`}
                {status !== 'ALL' && ` (${events.filter(e => e.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'ALL' 
                ? "You haven't created any events yet" 
                : `No ${filter.toLowerCase()} events`}
            </p>
            <button
              onClick={() => navigate('/create-event')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  
                  {/* Event Image */}
                  <div className="w-64 h-48 flex-shrink-0">
                    <img
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
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
                      
                      {event.status !== 'CANCELLED' && (
                        <>
                          <button
                            onClick={() => navigate(`/edit-event/${event.id}`)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Edit Event
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;