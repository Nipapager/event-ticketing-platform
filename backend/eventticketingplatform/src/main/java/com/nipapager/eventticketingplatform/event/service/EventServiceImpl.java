package com.nipapager.eventticketingplatform.event.service;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.category.repository.CategoryRepository;
import com.nipapager.eventticketingplatform.enums.EventStatus;
import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.event.dto.EventDTO;
import com.nipapager.eventticketingplatform.event.entity.Event;
import com.nipapager.eventticketingplatform.event.repository.EventRepository;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.ForbiddenException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.service.UserService;
import com.nipapager.eventticketingplatform.venue.entity.Venue;
import com.nipapager.eventticketingplatform.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service implementation for event operations
 * Handles business logic for event management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final VenueRepository venueRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    public Response<EventDTO> createEvent(EventDTO eventDTO) {
        log.info("Creating event: {}", eventDTO.getTitle());

        // Get current logged in user (organizer)
        User organizer = userService.getCurrentLoggedInUser();

        // Validate event date is in future
        if (eventDTO.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Event date must be in the future");
        }

        // Validate category exists
        Category category = categoryRepository.findById(eventDTO.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));

        // Validate venue exists
        Venue venue = venueRepository.findById(eventDTO.getVenueId())
                .orElseThrow(() -> new NotFoundException("Venue not found"));

        // Map DTO to entity
        Event event = modelMapper.map(eventDTO, Event.class);
        event.setCategory(category);
        event.setVenue(venue);
        event.setOrganizer(organizer);
        event.setStatus(EventStatus.PENDING);
        event.setCreatedAt(LocalDateTime.now());

        // Save event
        Event savedEvent = eventRepository.save(event);
        log.info("Event created successfully with ID: {} (Status: PENDING)", savedEvent.getId());

        // Map to DTO
        EventDTO savedDTO = mapToDTO(savedEvent);

        return Response.<EventDTO>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Event created successfully. Awaiting admin approval.")
                .data(savedDTO)
                .build();
    }

    @Override
    public Response<List<EventDTO>> getAllEvents() {
        log.info("Fetching all events");

        User currentUser = userService.getCurrentLoggedInUser();
        boolean isAdmin = isUserAdmin(currentUser);

        List<Event> events;

        if (isAdmin) {
            // Admin sees all events
            events = eventRepository.findAll();
            log.info("Admin fetching all events (including pending/rejected)");
        } else {
            // Regular users see only approved events
            events = eventRepository.findByStatus(EventStatus.APPROVED);
            log.info("User fetching approved events only");
        }

        // Map to DTOs
        List<EventDTO> eventDTOs = events.stream()
                .map(this::mapToDTO)
                .toList();

        return Response.<List<EventDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Events retrieved successfully")
                .data(eventDTOs)
                .build();
    }

    @Override
    public Response<EventDTO> getEventById(Long id) {
        log.info("Fetching event with id: {}", id);

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + id));

        // Map to DTO
        EventDTO eventDTO = mapToDTO(event);

        return Response.<EventDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event retrieved successfully")
                .data(eventDTO)
                .build();
    }

    @Override
    public Response<EventDTO> updateEvent(Long id, EventDTO eventDTO) {
        log.info("Updating event with id: {}", id);

        // Find existing event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + id));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkEventEditPermission(event, currentUser);

        // Can't update cancelled or past events
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Cannot update cancelled event");
        }
        if (event.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot update past event");
        }

        // Update fields if provided
        if (eventDTO.getTitle() != null && !eventDTO.getTitle().isEmpty()) {
            event.setTitle(eventDTO.getTitle());
        }

        if (eventDTO.getDescription() != null && !eventDTO.getDescription().isEmpty()) {
            event.setDescription(eventDTO.getDescription());
        }

        if (eventDTO.getEventDate() != null) {
            if (eventDTO.getEventDate().isBefore(LocalDate.now())) {
                throw new BadRequestException("Event date must be in the future");
            }
            event.setEventDate(eventDTO.getEventDate());
        }

        if (eventDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(eventDTO.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            event.setCategory(category);
        }

        if (eventDTO.getVenueId() != null) {
            Venue venue = venueRepository.findById(eventDTO.getVenueId())
                    .orElseThrow(() -> new NotFoundException("Venue not found"));
            event.setVenue(venue);
        }

        if (eventDTO.getImageUrl() != null && !eventDTO.getImageUrl().isEmpty()) {
            event.setImageUrl(eventDTO.getImageUrl());
        }

        event.setUpdatedAt(LocalDateTime.now());

        // Save updated event
        Event savedEvent = eventRepository.save(event);
        log.info("Event updated successfully: {}", savedEvent.getId());

        // Map to DTO
        EventDTO updatedDTO = mapToDTO(savedEvent);

        return Response.<EventDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event updated successfully")
                .data(updatedDTO)
                .build();
    }

    @Override
    public Response<Void> deleteEvent(Long id) {
        log.info("Deleting event with id: {}", id);

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + id));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkEventEditPermission(event, currentUser);

        // Soft delete - set status to CANCELLED
        event.setStatus(EventStatus.CANCELLED);
        event.setUpdatedAt(LocalDateTime.now());
        eventRepository.save(event);

        log.info("Event cancelled successfully: {}", id);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event cancelled successfully")
                .build();
    }

    @Override
    public Response<List<EventDTO>> searchEvents(
            String city,
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate) {

        log.info("Searching events - city: {}, category: {}, dates: {} to {}",
                city, categoryId, startDate, endDate);

        // Convert LocalDate to LocalDateTime
        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;

        // Search with filters (only approved events)
        List<Event> events = eventRepository.searchEvents(city, categoryId, startDateTime, endDateTime);

        // Map to DTOs
        List<EventDTO> eventDTOs = events.stream()
                .map(this::mapToDTO)
                .toList();

        return Response.<List<EventDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Events found: " + eventDTOs.size())
                .data(eventDTOs)
                .build();
    }

    @Override
    public Response<EventDTO> approveEvent(Long id) {
        log.info("Approving event with id: {}", id);

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + id));

        // Check if already approved
        if (event.getStatus() == EventStatus.APPROVED) {
            throw new BadRequestException("Event is already approved");
        }

        // Approve event
        event.setStatus(EventStatus.APPROVED);
        event.setUpdatedAt(LocalDateTime.now());
        Event savedEvent = eventRepository.save(event);

        log.info("Event approved successfully: {}", id);

        // Map to DTO
        EventDTO eventDTO = mapToDTO(savedEvent);

        return Response.<EventDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event approved successfully")
                .data(eventDTO)
                .build();
    }

    @Override
    public Response<EventDTO> rejectEvent(Long id) {
        log.info("Rejecting event with id: {}", id);

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + id));

        // Reject event
        event.setStatus(EventStatus.REJECTED);
        event.setUpdatedAt(LocalDateTime.now());
        Event savedEvent = eventRepository.save(event);

        log.info("Event rejected successfully: {}", id);

        // Map to DTO
        EventDTO eventDTO = mapToDTO(savedEvent);

        return Response.<EventDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event rejected successfully")
                .data(eventDTO)
                .build();
    }

    @Override
    public Response<List<EventDTO>> getMyEvents() {
        log.info("Fetching events for current organizer");

        // Get current user
        User organizer = userService.getCurrentLoggedInUser();

        // Find all events by this organizer
        List<Event> events = eventRepository.findByOrganizerId(organizer.getId());

        // Map to DTOs
        List<EventDTO> eventDTOs = events.stream()
                .map(this::mapToDTO)
                .toList();

        return Response.<List<EventDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Your events retrieved successfully")
                .data(eventDTOs)
                .build();
    }

    // ========== HELPER METHODS ==========

    /**
     * Map Event entity to EventDTO
     */
    private EventDTO mapToDTO(Event event) {
        EventDTO dto = modelMapper.map(event, EventDTO.class);

        // Set IDs and names for relationships
        dto.setCategoryId(event.getCategory().getId());
        dto.setCategoryName(event.getCategory().getName());

        dto.setVenueId(event.getVenue().getId());
        dto.setVenueName(event.getVenue().getName());

        dto.setOrganizerId(event.getOrganizer().getId());
        dto.setOrganizerName(event.getOrganizer().getName());

        return dto;
    }

    /**
     * Check if user has permission to edit event
     * Only organizer or admin can edit
     */
    private void checkEventEditPermission(Event event, User user) {
        boolean isOrganizer = event.getOrganizer().getId().equals(user.getId());
        boolean isAdmin = isUserAdmin(user);

        if (!isOrganizer && !isAdmin) {
            throw new ForbiddenException("You don't have permission to modify this event");
        }
    }

    /**
     * Check if user is admin
     */
    private boolean isUserAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == UserRole.ROLE_ADMIN);
    }
}