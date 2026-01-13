import { useState, useEffect } from 'react';
import reviewService from '../../api/reviewService';
import type { ReviewDTO } from '../../api/reviewService';
import LoadingSpinner from '../common/LoadingSpinner';

interface ReviewsSectionProps {
  eventId: number;
}

const ReviewsSection = ({ eventId }: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const [reviewsData, summaryData] = await Promise.all([
        reviewService.getEventReviews(eventId),
        reviewService.getReviewSummary(eventId)
      ]);

      // Sort by rating (highest first)
      const sortedReviews = reviewsData.sort((a, b) => b.rating - a.rating);
      
      setReviews(sortedReviews);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        <LoadingSpinner message="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        
        {/* Summary */}
        {summary.totalReviews > 0 && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">
                {summary.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mt-1">
                {renderStars(Math.round(summary.averageRating))}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <div className="flex-1 border-l pl-4">
              <p className="text-sm text-gray-700">
                Based on {summary.totalReviews} attendee {summary.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No reviews yet</h3>
          <p className="text-gray-600">Be the first to review this event!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-800">{review.rating}</span>
                </div>
              </div>

              {/* Review Comment */}
              {review.comment && (
                <div className="mt-3">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {review.comment}
                  </p>
                </div>
              )}

              {/* Updated indicator */}
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <div className="mt-2 text-xs text-gray-500 italic">
                  Edited
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;