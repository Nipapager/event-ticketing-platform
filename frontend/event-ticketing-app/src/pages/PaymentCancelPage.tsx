import { useNavigate } from 'react-router-dom';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">Your payment was not completed</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-2">
              You have cancelled the payment process.
            </p>
            <p className="text-gray-600">
              Your order has not been placed and no charges were made.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-yellow-800 mb-1">What Happened?</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• You clicked the back button or closed the payment window</li>
                  <li>• No payment has been processed</li>
                  <li>• Your tickets have been released back to inventory</li>
                </ul>
              </div>
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
              <p className="font-semibold text-blue-800 mb-1">Want to Try Again?</p>
              <p className="text-sm text-blue-700">
                You can go back to the event page and try booking again. The tickets are still available!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/events')}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Browse Events
          </button>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-2">
            Need help? Contact our support team
          </p>
          <a href="mailto:support@eventspot.com" className="text-blue-600 hover:underline text-sm">
            support@eventspot.com
          </a>
        </div>

      </div>
    </div>
  );
};

export default PaymentCancelPage;