package com.nipapager.eventticketingplatform.venue.dto;
import lombok.Data;

import java.time.LocalDateTime;


/**
 * DTO for Venue entity
 */
@Data
public class VenueDTO {
    private Long id;
    private String name;
    private String city;
    private String address;
    private Integer capacity;
    private String description;
    private String imageUrl;
    private String mapCoordinates;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
