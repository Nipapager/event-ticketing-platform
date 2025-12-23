package com.nipapager.eventticketingplatform.event.controller;

import com.nipapager.eventticketingplatform.event.dto.TicketTypeDTO;
import com.nipapager.eventticketingplatform.event.service.TicketTypeService;
import com.nipapager.eventticketingplatform.response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for ticket type management
 */
@RestController
@RequestMapping("/api/ticket-types")
@RequiredArgsConstructor
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;

    @PostMapping("/event/{eventId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<TicketTypeDTO>> createTicketType(
            @PathVariable Long eventId,
            @RequestBody TicketTypeDTO ticketTypeDTO) {
        Response<TicketTypeDTO> response = ticketTypeService.createTicketType(eventId, ticketTypeDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Response<List<TicketTypeDTO>>> getTicketTypesByEventId(@PathVariable Long eventId) {
        Response<List<TicketTypeDTO>> response = ticketTypeService.getTicketTypesByEventId(eventId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<TicketTypeDTO>> getTicketTypeById(@PathVariable Long id) {
        Response<TicketTypeDTO> response = ticketTypeService.getTicketTypeById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<TicketTypeDTO>> updateTicketType(
            @PathVariable Long id,
            @RequestBody TicketTypeDTO ticketTypeDTO) {
        Response<TicketTypeDTO> response = ticketTypeService.updateTicketType(id, ticketTypeDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<Void>> deleteTicketType(@PathVariable Long id) {
        Response<Void> response = ticketTypeService.deleteTicketType(id);
        return ResponseEntity.ok(response);
    }
}