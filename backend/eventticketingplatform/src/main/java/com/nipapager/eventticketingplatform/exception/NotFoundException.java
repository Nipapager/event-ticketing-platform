package com.nipapager.eventticketingplatform.exception;

/**
 * Exception thrown when a requested resource is not found
 * Returns HTTP 404 status
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
