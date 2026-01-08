package com.nipapager.eventticketingplatform.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Order entity
 * Represents a ticket order with all related information
 */
@Data
public class OrderDTO {

    private Long id;

    // User info
    private Long userId;
    private String userName;
    private String userEmail;

    // Event info
    private Long eventId;
    private String eventTitle;
    private LocalDate eventDate;

    private BigDecimal totalAmount;

    private String paymentStatus;

    private String status;  // OrderStatus as String

    // Order items (tickets)
    private List<OrderItemDTO> orderItems;

    private LocalDateTime orderDate;
    private LocalDateTime updatedAt;
}