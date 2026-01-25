import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event, Order } from '../types';
import eventService from '../api/eventService';
import orderService from '../api/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface EventAnalytics {
  event: Event;
  orders: Order[];
  totalTicketsSold: number;
  totalRevenue: number;
  availableTickets: number;
  soldOutPercentage: number;
}

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventAnalytics, setEventAnalytics] = useState<EventAnalytics[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  // Overall statistics
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const fetchOrganizerData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch organizer's events
      const eventsData = await eventService.getMyEvents();
      setEvents(eventsData);

      // Fetch orders for each event and calculate analytics
      const analyticsPromises = eventsData.map(async (event) => {
        try {
          const orders = await orderService.getOrdersByEventId(event.id);

          // Calculate tickets sold
          const totalTicketsSold = orders
            .filter(order => order.status === 'CONFIRMED' || order.status === 'COMPLETED')
            .reduce((sum, order) => {
              return sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
            }, 0);

          // Calculate revenue
          const totalRevenue = orders
            .filter(order => order.status === 'CONFIRMED' || order.status === 'COMPLETED')
            .reduce((sum, order) => sum + order.totalAmount, 0);

          // Calculate available tickets
          const totalCapacity = event.ticketTypes?.reduce(
            (sum, tt) => sum + tt.totalQuantity, 0
          ) || 0;
          const availableTickets = event.ticketTypes?.reduce(
            (sum, tt) => sum + tt.quantityAvailable, 0
          ) || 0;

          const soldOutPercentage = totalCapacity > 0
            ? ((totalCapacity - availableTickets) / totalCapacity) * 100
            : 0;

          return {
            event,
            orders,
            totalTicketsSold,
            totalRevenue,
            availableTickets,
            soldOutPercentage,
          };
        } catch (err) {
          console.error(`Error fetching data for event ${event.id}:`, err);
          return {
            event,
            orders: [],
            totalTicketsSold: 0,
            totalRevenue: 0,
            availableTickets: 0,
            soldOutPercentage: 0,
          };
        }
      });

      const analytics = await Promise.all(analyticsPromises);
      setEventAnalytics(analytics);

      // Calculate overall statistics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setTotalEvents(eventsData.length);
      setUpcomingEvents(
        eventsData.filter(e => new Date(e.eventDate) >= today).length
      );

      const totalRev = analytics.reduce((sum, a) => sum + a.totalRevenue, 0);
      setTotalRevenue(totalRev);

      const totalTix = analytics.reduce((sum, a) => sum + a.totalTicketsSold, 0);
      setTotalTicketsSold(totalTix);

    } catch (err: any) {
      console.error('Error fetching organizer data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Filter events by tab
  const filteredAnalytics = eventAnalytics.filter((analytics) => {
    const eventDate = new Date(analytics.event.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedTab === 'upcoming') {
      return eventDate >= today;
    } else {
      return eventDate < today;
    }
  });

  // Sort by event date
  const sortedAnalytics = [...filteredAnalytics].sort((a, b) => {
    const dateA = new Date(a.event.eventDate).getTime();
    const dateB = new Date(b.event.eventDate).getTime();
    return selectedTab === 'upcoming' ? dateA - dateB : dateB - dateA;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your events and track performance
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalEvents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{upcomingEvents}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">€{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{totalTicketsSold}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Upcoming/Past Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setSelectedTab('upcoming')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${selectedTab === 'upcoming'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Upcoming Events ({events.filter(e => new Date(e.eventDate) >= new Date()).length})
              </button>
              <button
                onClick={() => setSelectedTab('past')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${selectedTab === 'past'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Past Events ({events.filter(e => new Date(e.eventDate) < new Date()).length})
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="p-6">
            {sortedAnalytics.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No {selectedTab} events
                </h3>
                <p className="mt-1 text-gray-500">
                  {selectedTab === 'upcoming'
                    ? 'Create your first event to get started!'
                    : 'Your past events will appear here.'}
                </p>
                {selectedTab === 'upcoming' && (
                  <button
                    onClick={() => navigate('/create-event')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Event
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAnalytics.map((analytics) => (
                  <div
                    key={analytics.event.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {analytics.event.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${analytics.event.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : analytics.event.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {analytics.event.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(analytics.event.eventDate).toLocaleDateString('el-GR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {analytics.event.venueCity}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {analytics.event.categoryName}
                          </span>
                        </div>

                        {/* Analytics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-blue-600 font-medium mb-1">Revenue</p>
                            <p className="text-lg font-bold text-blue-900">
                              €{analytics.totalRevenue.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs text-green-600 font-medium mb-1">Tickets Sold</p>
                            <p className="text-lg font-bold text-green-900">
                              {analytics.totalTicketsSold}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-xs text-purple-600 font-medium mb-1">Available</p>
                            <p className="text-lg font-bold text-purple-900">
                              {analytics.availableTickets}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-3">
                            <p className="text-xs text-orange-600 font-medium mb-1">Sold Out</p>
                            <p className="text-lg font-bold text-orange-900">
                              {analytics.soldOutPercentage.toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        {/* Orders Count */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{analytics.orders.length} total orders</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/events/${analytics.event.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Event"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {selectedTab === 'upcoming' && (
                          <button
                            onClick={() => navigate(`/edit-event/${analytics.event.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
