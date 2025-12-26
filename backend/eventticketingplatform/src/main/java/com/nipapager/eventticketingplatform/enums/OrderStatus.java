package com.nipapager.eventticketingplatform.enums;

/**
 * Represents the status of a ticket order
 */
public enum OrderStatus {
    PENDING,      // Order created, awaiting payment
    CONFIRMED,    // Payment confirmed, processing tickets
    COMPLETED,    // Payment successful, tickets issued
    CANCELLED     // Order cancelled
}