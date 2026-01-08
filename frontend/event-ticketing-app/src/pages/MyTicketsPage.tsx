import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';
import authService from '../api/authService';
import type { Order } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError('Failed to load your tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your tickets..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tickets</h1>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>

        {/* No orders state */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No tickets yet</h2>
            <p className="text-gray-600 mb-6">
              Book your first event to see your tickets here
            </p>
            <button
              onClick={() => navigate('/events')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">

                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b">
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {order.eventTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.eventDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Tickets with QR Codes */}
                  <div className="space-y-4 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* Ticket Info */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">
                              {item.quantity}x {item.ticketTypeName}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              €{item.pricePerTicket.toFixed(2)} each
                            </p>
                            {item.ticketCode && (
                              <p className="text-xs text-gray-500 font-mono">
                                Code: {item.ticketCode}
                              </p>
                            )}
                            {item.isValid === false && (
                              <p className="text-xs text-red-600 font-semibold mt-1">
                                ⚠️ Invalid (Refunded)
                              </p>
                            )}
                          </div>

                          {/* QR Code */}
                          {item.qrCodeUrl && item.isValid !== false ? (
                            <div className="flex items-center gap-3">
                              <div 
                                className="cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => setSelectedQR(item.qrCodeUrl!)}
                              >
                                <img 
                                  src={item.qrCodeUrl} 
                                  alt="QR Code" 
                                  className="w-20 h-20 border-2 border-gray-300 rounded-lg"
                                />
                              </div>
                              <button
                                onClick={() => setSelectedQR(item.qrCodeUrl!)}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                              >
                                View
                              </button>
                            </div>
                          ) : order.status === 'CONFIRMED' ? (
                            <div className="text-sm text-gray-500 italic">
                              QR code generating...
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="border-t pt-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="text-sm space-y-1">
                        <div className="flex gap-2">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-semibold text-gray-800">#{order.id}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="text-gray-800">
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                        <p className="text-2xl font-bold text-gray-800">
                          €{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => navigate(`/events/${order.eventId}`)}
                      className="flex-1 md:flex-none border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      View Event
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Modal */}
        {selectedQR && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedQR(null)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Your Ticket QR Code</h3>
                <button
                  onClick={() => setSelectedQR(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center mb-4">
                <img 
                  src={selectedQR} 
                  alt="QR Code" 
                  className="w-64 h-64 border-4 border-gray-300 rounded-lg"
                />
              </div>
              <p className="text-center text-sm text-gray-600 mb-4">
                Show this QR code at the venue entrance
              </p>
              <button
                onClick={() => setSelectedQR(null)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;