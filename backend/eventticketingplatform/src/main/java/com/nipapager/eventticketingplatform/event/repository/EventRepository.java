package com.nipapager.eventticketingplatform.event.repository;

import com.nipapager.eventticketingplatform.enums.EventStatus;
import com.nipapager.eventticketingplatform.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Event entity
 * Provides database operations for events
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events by status
    List<Event> findByStatus(EventStatus status);

    // Find events by organizer
    List<Event> findByOrganizerId(Long organizerId);

    // Complex search with multiple filters
    @Query("SELECT e FROM Event e WHERE " +
            "(:city IS NULL OR e.venue.city = :city) AND " +
            "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
            "(:startDate IS NULL OR e.eventDate >= :startDate) AND " +
            "(:endDate IS NULL OR e.eventDate <= :endDate) AND " +
            "e.status = 'APPROVED'")
    List<Event> searchEvents(
            @Param("city") String city,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}