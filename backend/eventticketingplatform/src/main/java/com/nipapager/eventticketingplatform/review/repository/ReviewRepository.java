package com.nipapager.eventticketingplatform.review.repository;

import com.nipapager.eventticketingplatform.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Review entity
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find reviews by event
    List<Review> findByEventId(Long eventId);

    // Find reviews by user
    List<Review> findByUserId(Long userId);

    // Check if user already reviewed event
    Boolean existsByUserIdAndEventId(Long userId, Long eventId);

    // Find specific review by user and event
    Optional<Review> findByUserIdAndEventId(Long userId, Long eventId);

    // Get average rating for an event
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.event.id = :eventId")
    Double getAverageRatingForEvent(@Param("eventId") Long eventId);

    // Get review count for an event
    @Query("SELECT COUNT(r) FROM Review r WHERE r.event.id = :eventId")
    Long getReviewCountForEvent(@Param("eventId") Long eventId);
}