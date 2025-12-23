package com.nipapager.eventticketingplatform.event.service;

import com.nipapager.eventticketingplatform.event.dto.TicketTypeDTO;
import com.nipapager.eventticketingplatform.response.Response;

import java.util.List;

/**
 * Service interface for ticket type operations
 */
public interface TicketTypeService {

    Response<TicketTypeDTO> createTicketType(Long eventId, TicketTypeDTO ticketTypeDTO);

    Response<List<TicketTypeDTO>> getTicketTypesByEventId(Long eventId);

    Response<TicketTypeDTO> getTicketTypeById(Long id);

    Response<TicketTypeDTO> updateTicketType(Long id, TicketTypeDTO ticketTypeDTO);

    Response<Void> deleteTicketType(Long id);
}