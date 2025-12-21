package com.nipapager.eventticketingplatform.event.service;

import com.nipapager.eventticketingplatform.event.dto.EventDTO;
import com.nipapager.eventticketingplatform.response.Response;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for event operations
 */
public interface EventService {

    Response<EventDTO> createEvent(EventDTO eventDTO);

    Response<List<EventDTO>> getAllEvents();

    Response<EventDTO> getEventById(Long id);

    Response<EventDTO> updateEvent(Long id, EventDTO eventDTO);

    Response<Void> deleteEvent(Long id);

    Response<List<EventDTO>> searchEvents(
            String city,
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate
    );

    Response<EventDTO> approveEvent(Long id);

    Response<EventDTO> rejectEvent(Long id);

    Response<List<EventDTO>> getMyEvents();
}