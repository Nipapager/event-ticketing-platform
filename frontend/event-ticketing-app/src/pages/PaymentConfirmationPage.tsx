import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';
import type { Order } from '../types';

interface ConfirmationState {
  orderId: number;
}

const PaymentConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const confirmationData = location.state as ConfirmationState;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!confirmationData?.orderId) {
      navigate('/events');
      return;
    }

    fetchOrderDetails();
  }, [confirmationData]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(confirmationData.orderId);
      setOrder(orderData);
    } catch (err: any) {
      setError('Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
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
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>

        {/* Order Summary Card */}
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

          {/* Payment Date */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Payment Date: {new Date(order.orderDate).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
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

          {/* Total Amount */}
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

        {/* Payment Method (Mock) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4v2h16V8H4zm0 4v4h16v-4H4z"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Credit Card</p>
              <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-800 mb-1">What's Next?</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Payment confirmation sent to {order.userEmail}</li>
                <li>✓ Your tickets are now available in "My Tickets"</li>
                <li>✓ Show your QR code at the venue entrance</li>
                <li>✓ Check your email for receipt and event details</li>
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

        {/* Download Receipt */}
        <div className="text-center mt-6">
          <button className="text-blue-600 hover:underline text-sm flex items-center gap-2 mx-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Receipt (PDF)
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentConfirmationPage;