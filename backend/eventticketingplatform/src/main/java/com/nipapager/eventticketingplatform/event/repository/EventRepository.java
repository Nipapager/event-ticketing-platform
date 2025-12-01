package com.nipapager.eventticketingplatform.event.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Event entity
 * Provides database operations for events
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

}