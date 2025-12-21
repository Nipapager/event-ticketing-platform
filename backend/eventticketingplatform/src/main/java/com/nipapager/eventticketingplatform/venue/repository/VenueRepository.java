package com.nipapager.eventticketingplatform.venue.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.venue.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Venue entity
 * Provides database operations for venues
 */
@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    Optional<Venue> findByName(String name);

    List<Venue> findByCity(String city);

    Boolean existsByAddress(String address);
}