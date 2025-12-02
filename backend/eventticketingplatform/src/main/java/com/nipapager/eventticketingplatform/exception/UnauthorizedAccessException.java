package com.nipapager.eventticketingplatform.exception;

/**
 * Exception thrown when user doesn't have permission to access a resource
 * Returns HTTP 403 status
 */
public class UnauthorizedAccessException extends RuntimeException {

    public UnauthorizedAccessException(String message) {
        super(message);
    }
}