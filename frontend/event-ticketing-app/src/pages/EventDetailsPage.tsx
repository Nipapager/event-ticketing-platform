import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../api/eventService';
import type { Event, TicketType } from '../types';
import authService from '../api/authService';

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
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

              {/* Map placeholder */}
              <div className="bg-gray-200 rounded-lg h-64 mb-4 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p>Map integration coming soon</p>
                </div>
              </div>

              {/* Venue details */}
              <div className="text-gray-700">
                <p className="font-semibold">{event.venueName}</p>
                {event.venueAddress && <p>{event.venueAddress}</p>}
                {event.venueCity && <p>{event.venueCity}</p>}
                {event.venueCapacity && (
                  <p className="text-sm text-gray-600 mt-2">
                    Capacity: {event.venueCapacity.toLocaleString()} people
                  </p>
                )}
              </div>
            </div>

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