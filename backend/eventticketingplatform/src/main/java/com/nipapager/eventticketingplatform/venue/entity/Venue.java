package com.nipapager.eventticketingplatform.venue.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing event venues
 * Maps to 'venues' table in database
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "venues")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;  // Required for city-based search

    @Column(nullable = false)
    private String address;

    private Integer capacity;  // Max capacity of venue

    private String description;

    private String imageUrl;

    private String mapCoordinates;  // For Google Maps integration

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}