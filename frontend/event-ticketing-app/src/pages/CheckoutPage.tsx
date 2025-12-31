import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';
import eventService from '../api/eventService';
import authService from '../api/authService';
import type { Event, TicketType, OrderRequest } from '../types';

interface CheckoutState {
  eventId: number;
  ticketTypeId: number;
  quantity: number;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutData = location.state as CheckoutState;

  const [event, setEvent] = useState<Event | null>(null);
  const [ticketType, setTicketType] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Redirect if no checkout data
    if (!checkoutData) {
      navigate('/events');
      return;
    }

    fetchEventDetails();
  }, [checkoutData]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(checkoutData.eventId);
      setEvent(eventData);

      // Find selected ticket type
      const ticket = eventData.ticketTypes?.find(t => t.id === checkoutData.ticketTypeId);
      if (ticket) {
        setTicketType(ticket);
      }
    } catch (err: any) {
      setError('Failed to load event details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!ticketType) return 0;
    return ticketType.price * checkoutData.quantity;
  };

  const handleConfirmBooking = async () => {
    if (!event || !ticketType) return;

    try {
      setProcessing(true);
      setError('');

      // Create order request
      const orderRequest: OrderRequest = {
        eventId: event.id,
        items: [
          {
            ticketTypeId: ticketType.id,
            quantity: checkoutData.quantity,
          },
        ],
      };

      // Create order
      const order = await orderService.createOrder(orderRequest);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Confirm order (simulate successful payment)
      await orderService.confirmOrder(order.id);

      // Navigate to confirmation page
      navigate('/payment-confirmation', { state: { orderId: order.id } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!event || !ticketType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Invalid booking data</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600 mt-1">Review your booking details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Event Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Event Details</h2>

              <div className="flex gap-4">
                {/* Event Image */}
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                )}

                {/* Event Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{event.title}</h3>

                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.eventDate)} • {event.eventTime ? formatTime(event.eventTime) : 'TBD'}
                  </div>

                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {event.venueName}, {event.venueCity}
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ticket Details</h2>

              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{ticketType.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {checkoutData.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    €{ticketType.price.toFixed(2)} × {checkoutData.quantity}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">€{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Details</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-800">{currentUser?.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-800">{currentUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Tickets ({checkoutData.quantity}x)</span>
                  <span>€{calculateTotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Service Fee</span>
                  <span>€0.00</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-gray-800">
                    €{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Confirm & Pay'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment processing
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;