package com.nipapager.eventticketingplatform.event.dto;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.enums.EventStatus;
import com.nipapager.eventticketingplatform.event.entity.TicketType;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.venue.entity.Venue;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class EventDTO {

    private Long id;

    private String title;

    private String description;

    private Long categoryId;

    private String categoryName;

    private Long venueId;

    private String venueName;

    private LocalDate eventDate;

    private LocalTime eventTime;

    private String imageUrl;

    private Long organizerId;

    private String organizerName;

    private String status;

    private Boolean isFeatured;

    private List<TicketTypeDTO> ticketTypes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
