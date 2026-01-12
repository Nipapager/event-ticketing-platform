package com.nipapager.eventticketingplatform.event.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing ticket types for events
 * Each event can have multiple ticket types with different prices
 * Maps to 'ticket_types' table in database
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ticket_types")
public class TicketType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @ToString.Exclude
    private Event event;

    @Column(nullable = false)
    private String name;  // e.g., "VIP", "General Admission", "Student"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer totalQuantity;  // Total tickets for this type

    @Column(nullable = false)
    private Integer quantityAvailable;  // Remaining tickets

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (quantityAvailable == null) {
            quantityAvailable = totalQuantity;
        }
        createdAt = LocalDateTime.now();
    }
}