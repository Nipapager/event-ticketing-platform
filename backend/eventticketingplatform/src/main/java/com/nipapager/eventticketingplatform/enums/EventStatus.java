package com.nipapager.eventticketingplatform.enums;

/**
 * Represents the lifecycle status of an event
 */
public enum EventStatus {
    PENDING,      // Awaiting admin approval
    APPROVED,     // Approved and visible to users
    ACTIVE,       // Event is currently happening
    CANCELLED     // Event has been cancelled
}