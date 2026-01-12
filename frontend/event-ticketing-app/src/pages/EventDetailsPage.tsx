import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../api/eventService';
import type { Event, TicketType } from '../types';
import authService from '../api/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventMap from '../components/common/EventMap';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking state
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await eventService.getEventById(parseInt(id));
        setEvent(data);

        // Auto-select first ticket type
        if (data.ticketTypes && data.ticketTypes.length > 0) {
          setSelectedTicketType(data.ticketTypes[0]);
        }
      } catch (err: any) {
        setError('Event not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedTicketType) return 0;
    return selectedTicketType.price * quantity;
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && selectedTicketType && newQuantity <= selectedTicketType.quantityAvailable) {
      setQuantity(newQuantity);
    }
  };

  // Handle ticket type change
  const handleTicketTypeChange = (ticketId: number) => {
    const ticket = event?.ticketTypes?.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicketType(ticket);
      setQuantity(1);
    }
  };

  // Handle booking
  const handleBookNow = () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    if (!selectedTicketType) {
      alert('Please select a ticket type');
      return;
    }

    // Navigate to checkout with booking data
    navigate('/checkout', {
      state: {
        eventId: event!.id,
        ticketTypeId: selectedTicketType.id,
        quantity: quantity,
      },
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-8">

      {/* Hero Image */}
      <div className="relative h-80 md:h-96 bg-gray-200">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
            <span className="text-white text-6xl">🎉</span>
          </div>
        )}

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Back button */}
        <button
          onClick={() => navigate('/events')}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content area */}
          <div className="lg:col-span-2">

            {/* Event title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {event.title}
            </h1>

            {/* Date and time */}
            <div className="flex items-center text-gray-600 mb-2">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {formatDate(event.eventDate)} • {event.eventTime ? formatTime(event.eventTime) : 'TBD'}
              </span>
            </div>

            {/* Venue location */}
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.venueName}, {event.venueCity}</span>
            </div>

            {/* Category badge */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {event.categoryName}
              </span>
            </div>

            {/* About section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About the Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Location section with map */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>

              {/* Map */}
              <div className="mb-4">
                <EventMap
                  latitude={event.venueLatitude || 0}
                  longitude={event.venueLongitude || 0}
                  venueName={event.venueName}
                  venueAddress={event.venueAddress || ''}
                  height="360px"
                />
              </div>

              {/* Venue details */}
              <div className="text-gray-700 space-y-2">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">{event.venueName}</p>
                    {event.venueCapacity && (
                      <p className="text-sm text-gray-500">Capacity: {event.venueCapacity.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    {event.venueAddress && <p className="text-gray-700">{event.venueAddress}</p>}
                    {event.venueCity && <p className="text-gray-600">{event.venueCity}, Greece</p>}
                  </div>
                </div>



              </div>
            </div>

            {/* Ticket Information Section */}
            {event.ticketTypes && event.ticketTypes.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Tickets</h2>
                <div className="space-y-4">
                  {event.ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {ticket.name}
                          </h3>
                          <p className="text-2xl font-bold text-blue-600 mt-1">
                            €{ticket.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          {ticket.quantityAvailable > 0 ? (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                              {ticket.quantityAvailable} available
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Ticket Description */}
                      {ticket.description && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {ticket.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Note:</strong> Select your ticket type from the booking panel to proceed with your purchase.
                  </p>
                </div>
              </div>
            )}

            {/* Organizer section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Organizer</h2>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {event.organizerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{event.organizerName}</p>
                  <button className="text-blue-600 text-sm hover:underline mt-1">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar for desktop booking */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tickets</h2>

              {/* Starting price display */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-800">
                  From €{event.ticketTypes && event.ticketTypes.length > 0
                    ? Math.min(...event.ticketTypes.map(t => t.price)).toFixed(2)
                    : '0.00'}
                </p>
              </div>

              {event.ticketTypes && event.ticketTypes.length > 0 ? (
                <>
                  {/* Ticket type dropdown */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Type
                    </label>
                    <select
                      value={selectedTicketType?.id || ''}
                      onChange={(e) => handleTicketTypeChange(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {event.ticketTypes.map((ticket) => (
                        <option key={ticket.id} value={ticket.id}>
                          {ticket.name} - €{ticket.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                      >
                        −
                      </button>
                      <span className="px-4 py-3 font-semibold">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={!selectedTicketType || quantity >= selectedTicketType.quantityAvailable}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                    {selectedTicketType && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedTicketType.quantityAvailable} tickets available
                      </p>
                    )}
                  </div>

                  {/* Total price */}
                  <div className="flex justify-between items-center mb-4 py-3 border-t border-b">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-gray-800">
                      €{calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Book now button */}
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg"
                  >
                    Book Now
                  </button>

                  {/* Security note */}
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Secure booking, instant confirmation
                  </p>
                </>
              ) : (
                <p className="text-gray-600">No tickets available</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile sticky booking bar at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
        <div className="max-w-md mx-auto">
          {/* Price and quantity controls */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="text-2xl font-bold text-gray-800">
                €{event.ticketTypes && event.ticketTypes.length > 0
                  ? Math.min(...event.ticketTypes.map(t => t.price)).toFixed(2)
                  : '0.00'}
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                −
              </button>
              <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={!selectedTicketType || quantity >= selectedTicketType.quantityAvailable}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Ticket type selector for mobile */}
          {event.ticketTypes && event.ticketTypes.length > 0 && (
            <select
              value={selectedTicketType?.id || ''}
              onChange={(e) => handleTicketTypeChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm"
            >
              {event.ticketTypes.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.name} €{ticket.price.toFixed(2)}
                </option>
              ))}
            </select>
          )}

          {/* Total and book button */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Total:</p>
              <p className="text-xl font-bold text-gray-800">
                €{calculateTotal().toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleBookNow}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EventDetailsPage;