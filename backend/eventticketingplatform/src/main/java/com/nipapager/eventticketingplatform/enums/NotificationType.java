package com.nipapager.eventticketingplatform.enums;

/**
 * Represents types of email notifications
 */
public enum NotificationType {
    BOOKING_CONFIRMATION,  // Sent after successful booking
    EVENT_REMINDER,        // Sent 1 day before event
    REVIEW_REQUEST         // Sent after event completion
}