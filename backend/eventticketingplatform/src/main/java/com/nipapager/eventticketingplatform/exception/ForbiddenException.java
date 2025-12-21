package com.nipapager.eventticketingplatform.exception;

/**
 * Exception thrown when user doesn't have permission to access a resource
 * Results in HTTP 403 Forbidden
 */
public class ForbiddenException extends RuntimeException {

  public ForbiddenException(String message) {
    super(message);
  }
}