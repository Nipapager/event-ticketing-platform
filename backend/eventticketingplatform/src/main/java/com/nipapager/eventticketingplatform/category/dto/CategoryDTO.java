package com.nipapager.eventticketingplatform.category.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for Category entity
 */
@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
