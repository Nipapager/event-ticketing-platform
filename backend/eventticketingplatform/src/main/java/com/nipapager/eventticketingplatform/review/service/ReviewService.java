package com.nipapager.eventticketingplatform.review.service;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.review.dto.ReviewDTO;

import java.util.List;

/**
 * Service interface for review operations
 */
public interface ReviewService {

    Response<ReviewDTO> createReview(ReviewDTO reviewDTO);

    Response<List<ReviewDTO>> getReviewsByEventId(Long eventId);

    Response<ReviewDTO> getReviewById(Long id);

    Response<ReviewDTO> updateReview(Long id, ReviewDTO reviewDTO);

    Response<Void> deleteReview(Long id);

    // Get reviews by current user
    Response<List<ReviewDTO>> getMyReviews();
}