package com.nipapager.eventticketingplatform.event.controller;

import com.nipapager.eventticketingplatform.event.dto.EventDTO;
import com.nipapager.eventticketingplatform.event.service.EventService;
import com.nipapager.eventticketingplatform.response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for event management
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<EventDTO>> createEvent(@RequestBody EventDTO eventDTO) {
        Response<EventDTO> response = eventService.createEvent(eventDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping
    public ResponseEntity<Response<List<EventDTO>>> getAllEvents() {
        Response<List<EventDTO>> response = eventService.getAllEvents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<EventDTO>> getEventById(@PathVariable Long id) {
        Response<EventDTO> response = eventService.getEventById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<EventDTO>> updateEvent(
            @PathVariable Long id,
            @RequestBody EventDTO eventDTO) {
        Response<EventDTO> response = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<Void>> deleteEvent(@PathVariable Long id) {
        Response<Void> response = eventService.deleteEvent(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Response<List<EventDTO>>> searchEvents(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response<List<EventDTO>> response = eventService.searchEvents(city, categoryId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<EventDTO>> approveEvent(@PathVariable Long id) {
        Response<EventDTO> response = eventService.approveEvent(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<EventDTO>> rejectEvent(@PathVariable Long id) {
        Response<EventDTO> response = eventService.rejectEvent(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<List<EventDTO>>> getMyEvents() {
        Response<List<EventDTO>> response = eventService.getMyEvents();
        return ResponseEntity.ok(response);
    }
}