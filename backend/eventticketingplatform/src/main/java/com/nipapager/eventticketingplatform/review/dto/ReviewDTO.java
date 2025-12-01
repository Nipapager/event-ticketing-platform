package com.nipapager.eventticketingplatform.review.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for Review entity
 * Represents user reviews for events
 */
@Data
public class ReviewDTO {

    private Long id;

    private Long userId;


    private String userName;

    private Long eventId;

    private String eventName;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
