package com.nipapager.eventticketingplatform.payment.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for Payment entity
 * Contains payment transaction details
 */
@Data
public class PaymentDTO {

    private Long id;

    private Long userId;

    private String userName;

    private String userEmail;

    private Long orderId;

    private BigDecimal amount;

    private String status;

    private String transactionId;  // Stripe transaction ID

    private String paymentMethod;

    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
