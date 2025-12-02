package com.nipapager.eventticketingplatform.exception;

/**
 * Exception thrown when request data is invalid
 * Returns HTTP 400 status
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}