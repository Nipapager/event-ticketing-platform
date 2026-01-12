package com.nipapager.eventticketingplatform.event.entity;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.enums.EventStatus;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.venue.entity.Venue;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Entity representing events in the system
 * Maps to 'events' table in database
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @ToString.Exclude
    private Category category;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = false)
    @ToString.Exclude
    private Venue venue;

    @Column(nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private LocalTime eventTime;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    @ToString.Exclude
    private User organizer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status;

    private Boolean isFeatured;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<TicketType> ticketTypes;


    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = EventStatus.PENDING;
        }
        if (isFeatured == null) {
            isFeatured = false;
        }
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}