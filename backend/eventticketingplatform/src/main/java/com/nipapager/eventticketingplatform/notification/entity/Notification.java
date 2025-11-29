package com.nipapager.eventticketingplatform.notification.entity;

import com.nipapager.eventticketingplatform.enums.NotificationStatus;
import com.nipapager.eventticketingplatform.enums.NotificationType;
import com.nipapager.eventticketingplatform.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing email notifications sent to users
 * Tracks notification status and delivery
 * Maps to 'notifications' table in database
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    private LocalDateTime sentAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = NotificationStatus.PENDING;
        }
        createdAt = LocalDateTime.now();
    }
}