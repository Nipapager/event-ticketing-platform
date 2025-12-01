package com.nipapager.eventticketingplatform.event.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.event.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for TicketType entity
 * Provides database operations for ticket types
 */
@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {

}