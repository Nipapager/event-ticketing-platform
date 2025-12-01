package com.nipapager.eventticketingplatform.review.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Review entity
 * Provides database operations for reviews
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

}