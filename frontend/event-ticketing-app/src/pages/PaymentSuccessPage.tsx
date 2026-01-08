import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import orderService from '../api/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Order } from '../types';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Wait a bit for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fetch user's orders
        const orders = await orderService.getMyOrders();
        
        // Get the most recent order
        if (orders && orders.length > 0) {
          const latestOrder = orders[0];
          setOrder(latestOrder);
        }
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" message="Confirming your payment..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your booking has been confirmed</p>
        </div>

        {/* Order Details */}
        {order ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Order Summary</h2>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  {order.status}
                </span>
              </div>

              {/* Event Info */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Event</h3>
                <p className="text-lg font-bold text-gray-800">{order.eventTitle}</p>
                <p className="text-gray-600">{formatDate(order.eventDate)}</p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tickets Purchased</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start py-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.ticketTypeName}</p>
                        <p className="text-sm text-gray-600">
                          €{item.pricePerTicket.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        €{(item.pricePerTicket * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t-2">
                <span className="text-lg font-bold text-gray-800">Total Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">
                  €{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Billing Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Billing Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                  <p className="font-medium text-gray-800">{order.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-800">{order.userEmail}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">
                🎉 Payment confirmed! Your tickets have been booked.
              </p>
              <p className="text-gray-600">
                Check "My Tickets" to view your booking.
              </p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-800 mb-1">What's Next?</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Check your email for confirmation with QR codes</li>
                <li>✓ View your tickets in "My Tickets"</li>
                <li>✓ Show your QR code at venue entrance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/my-tickets')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            View My Tickets
          </button>
          <button
            onClick={() => navigate('/events')}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Browse More Events
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccessPage;