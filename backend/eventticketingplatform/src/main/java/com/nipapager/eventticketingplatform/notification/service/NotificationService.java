package com.nipapager.eventticketingplatform.notification.service;

import com.nipapager.eventticketingplatform.order.entity.Order;
import com.nipapager.eventticketingplatform.order.entity.OrderItem;
import com.nipapager.eventticketingplatform.event.entity.Event;
import com.nipapager.eventticketingplatform.user.entity.User;

import java.util.List;

/**
 * Service interface for sending email notifications
 */
public interface NotificationService {

    // User-related emails
    void sendWelcomeEmail(User user);
    void sendOrganizerUpgradeEmail(User user);

    // Order-related emails
    void sendTicketPurchaseEmail(Order order);
    void sendRefundEmail(Order order);

    // Event-related emails
    void sendEventCreatedEmail(Event event);
    void sendEventApprovedEmail(Event event);
}