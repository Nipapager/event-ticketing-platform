package com.nipapager.eventticketingplatform.notification.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Notification entity
 * Provides database operations for notifications
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

}