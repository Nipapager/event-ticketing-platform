package com.nipapager.eventticketingplatform.event.service;

import com.nipapager.eventticketingplatform.enums.EventStatus;
import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.event.dto.TicketTypeDTO;
import com.nipapager.eventticketingplatform.event.entity.Event;
import com.nipapager.eventticketingplatform.event.entity.TicketType;
import com.nipapager.eventticketingplatform.event.repository.EventRepository;
import com.nipapager.eventticketingplatform.event.repository.TicketTypeRepository;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.ForbiddenException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Service
public class TicketTypeServiceImpl implements TicketTypeService {

    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public Response<TicketTypeDTO> createTicketType(Long eventId, TicketTypeDTO ticketTypeDTO) {
        log.info("Creating ticket type: {} for event: {}", ticketTypeDTO.getName(), eventId);

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + eventId));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkEventPermission(event, currentUser);

        // Validate event is not cancelled or past
        validateEventModifiable(event);

        // Check for duplicate ticket type name in this event
        if (ticketTypeRepository.existsByEventIdAndName(eventId, ticketTypeDTO.getName())) {
            throw new BadRequestException("Ticket type with name '" + ticketTypeDTO.getName() + "' already exists for this event");
        }

        // Create ticket type entity
        TicketType ticketType = new TicketType();
        ticketType.setEvent(event);
        ticketType.setName(ticketTypeDTO.getName());
        ticketType.setPrice(ticketTypeDTO.getPrice());
        ticketType.setTotalQuantity(ticketTypeDTO.getTotalQuantity());
        ticketType.setQuantityAvailable(ticketTypeDTO.getTotalQuantity());
        ticketType.setDescription(ticketTypeDTO.getDescription());  // ✅ ADDED
        ticketType.setCreatedAt(LocalDateTime.now());

        // Save ticket type
        TicketType savedTicketType = ticketTypeRepository.save(ticketType);
        log.info("Ticket type created successfully with ID: {} (description: {})",
                savedTicketType.getId(),
                savedTicketType.getDescription() != null ? "Yes" : "No");

        // Map to DTO
        TicketTypeDTO savedDTO = mapToDTO(savedTicketType);

        return Response.<TicketTypeDTO>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Ticket type created successfully")
                .data(savedDTO)
                .build();
    }

    @Override
    public Response<List<TicketTypeDTO>> getTicketTypesByEventId(Long eventId) {
        log.info("Fetching ticket types for event: {}", eventId);

        // Validate event exists
        if (!eventRepository.existsById(eventId)) {
            throw new NotFoundException("Event not found with id: " + eventId);
        }

        // Get all ticket types for this event
        List<TicketType> ticketTypes = ticketTypeRepository.findByEventId(eventId);

        // Map to DTOs
        List<TicketTypeDTO> ticketTypeDTOs = ticketTypes.stream()
                .map(this::mapToDTO)
                .toList();

        return Response.<List<TicketTypeDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Ticket types retrieved successfully")
                .data(ticketTypeDTOs)
                .build();
    }

    @Override
    public Response<TicketTypeDTO> getTicketTypeById(Long id) {
        log.info("Fetching ticket type with id: {}", id);

        // Find ticket type
        TicketType ticketType = ticketTypeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket type not found with id: " + id));

        // Map to DTO
        TicketTypeDTO ticketTypeDTO = mapToDTO(ticketType);

        return Response.<TicketTypeDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Ticket type retrieved successfully")
                .data(ticketTypeDTO)
                .build();
    }

    @Override
    @Transactional
    public Response<TicketTypeDTO> updateTicketType(Long id, TicketTypeDTO ticketTypeDTO) {
        log.info("Updating ticket type with id: {}", id);

        // Find ticket type
        TicketType ticketType = ticketTypeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket type not found with id: " + id));

        // Get event
        Event event = ticketType.getEvent();

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkEventPermission(event, currentUser);

        // Validate event is not cancelled or past
        validateEventModifiable(event);

        // Update name if provided
        if (ticketTypeDTO.getName() != null && !ticketTypeDTO.getName().isEmpty()) {
            // Check for duplicate name (only if name is being changed)
            if (!ticketType.getName().equals(ticketTypeDTO.getName()) &&
                    ticketTypeRepository.existsByEventIdAndName(event.getId(), ticketTypeDTO.getName())) {
                throw new BadRequestException("Ticket type with name '" + ticketTypeDTO.getName() + "' already exists for this event");
            }
            ticketType.setName(ticketTypeDTO.getName());
        }

        // Update price if provided
        if (ticketTypeDTO.getPrice() != null) {
            ticketType.setPrice(ticketTypeDTO.getPrice());
        }

        // Update quantity if provided
        if (ticketTypeDTO.getQuantityAvailable() != null) {
            ticketType.setQuantityAvailable(ticketTypeDTO.getQuantityAvailable());
        }

        // Update description if provided  ✅ ADDED
        if (ticketTypeDTO.getDescription() != null) {
            ticketType.setDescription(ticketTypeDTO.getDescription());
            log.info("Updated description for ticket type {}: {}", id, ticketTypeDTO.getDescription());
        }

        ticketType.setUpdatedAt(LocalDateTime.now());

        // Save updated ticket type
        TicketType savedTicketType = ticketTypeRepository.save(ticketType);
        log.info("Ticket type updated successfully: {}", savedTicketType.getId());

        // Map to DTO
        TicketTypeDTO updatedDTO = mapToDTO(savedTicketType);

        return Response.<TicketTypeDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Ticket type updated successfully")
                .data(updatedDTO)
                .build();
    }

    @Override
    @Transactional
    public Response<Void> deleteTicketType(Long id) {
        log.info("Deleting ticket type with id: {}", id);

        // Find ticket type
        TicketType ticketType = ticketTypeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket type not found with id: " + id));

        // Get event
        Event event = ticketType.getEvent();

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkEventPermission(event, currentUser);

        // Validate event is not cancelled or past
        validateEventModifiable(event);

        // Delete ticket type
        ticketTypeRepository.deleteById(id);
        log.info("Ticket type deleted successfully: {}", id);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Ticket type deleted successfully")
                .build();
    }


    /**
     * Map TicketType entity to TicketTypeDTO
     */
    private TicketTypeDTO mapToDTO(TicketType ticketType) {
        TicketTypeDTO dto = modelMapper.map(ticketType, TicketTypeDTO.class);
        dto.setEventId(ticketType.getEvent().getId());
        dto.setEventName(ticketType.getEvent().getTitle());

        // Ensure description is never null - return empty string instead  ✅ ADDED
        if (dto.getDescription() == null) {
            dto.setDescription("");
        }

        return dto;
    }

    /**
     * Check if user has permission to modify event's ticket types
     * Only organizer or admin can modify
     */
    private void checkEventPermission(Event event, User user) {
        boolean isOrganizer = event.getOrganizer().getId().equals(user.getId());
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName() == UserRole.ROLE_ADMIN);

        if (!isOrganizer && !isAdmin) {
            throw new ForbiddenException("You don't have permission to modify ticket types for this event");
        }
    }

    /**
     * Validate that event can be modified
     * Can't modify if event is cancelled or has already happened
     */
    private void validateEventModifiable(Event event) {
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Cannot modify ticket types for cancelled event");
        }
        if (event.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot modify ticket types for past event");
        }
    }
}