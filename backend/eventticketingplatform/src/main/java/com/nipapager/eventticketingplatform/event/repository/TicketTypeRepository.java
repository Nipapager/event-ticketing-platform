package com.nipapager.eventticketingplatform.event.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.event.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for TicketType entity
 * Provides database operations for ticket types
 */
@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    // Find all ticket types for a specific event
    List<TicketType> findByEventId(Long eventId);

    // Check if ticket type name exists for an event (to prevent duplicates like "VIP", "VIP")
    Boolean existsByEventIdAndName(Long eventId, String name);
}