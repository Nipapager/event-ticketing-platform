package com.nipapager.eventticketingplatform.role.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for Role entity
 */
@Data
public class RoleDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}