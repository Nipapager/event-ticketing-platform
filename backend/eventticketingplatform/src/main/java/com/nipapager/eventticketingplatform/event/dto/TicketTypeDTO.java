package com.nipapager.eventticketingplatform.event.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for TicketType entity
 * Represents different ticket types for an event (VIP, General, etc.)
 */
@Data
public class TicketTypeDTO {

    private Long id;

    // Optional: Included when fetching tickets independently
    private Long eventId;
    private String eventName;

    private String name;  // e.g., "VIP", "General Admission"

    private BigDecimal price;

    private Integer totalQuantity;

    private Integer quantityAvailable;

    private LocalDateTime createdAt;
}