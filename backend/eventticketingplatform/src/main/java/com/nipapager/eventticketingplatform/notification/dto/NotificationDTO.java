package com.nipapager.eventticketingplatform.notification.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for Notification entity
 * Represents email notifications sent to users
 */
@Data
public class NotificationDTO {

    private Long id;

    private Long userId;

    private String userName;

    private String userEmail;

    private String message;

    private String type;

    private String status;

    private LocalDateTime sentAt;

    private LocalDateTime createdAt;
}
