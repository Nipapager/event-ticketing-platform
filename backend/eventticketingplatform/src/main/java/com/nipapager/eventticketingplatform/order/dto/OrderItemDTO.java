package com.nipapager.eventticketingplatform.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for OrderItem entity
 * Represents individual ticket items in an order
 */
@Data
public class OrderItemDTO {

    private Long id;

    private Long orderId;

    // Event info (for "My Tickets" page)
    private Long eventId;
    private String eventName;

    private String ticketTypeName;

    private Integer quantity;

    private BigDecimal pricePerTicket;

    private String qrCodeUrl;  // Base64 QR code image

    private String ticketCode;  // Unique ticket code

    private Boolean isValid;  // Ticket validity (for refunds)

    private LocalDateTime createdAt;
}