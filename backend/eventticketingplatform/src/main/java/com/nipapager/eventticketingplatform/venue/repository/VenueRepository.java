package com.nipapager.eventticketingplatform.venue.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.venue.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Venue entity
 * Provides database operations for venues
 */
@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {

}