package com.nipapager.eventticketingplatform.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.Map;

/**
 * Generic API response wrapper
 * Provides consistent response structure across all endpoints
 * @param <T> The type of data payload
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response<T> {

    private int statusCode;        // HTTP status code (e.g., 200, 404, 500)
    private String message;        // Human-readable message
    private T data;                // Generic payload (User, Event, List, etc.)
    private Map<String, Serializable> meta;  // Optional metadata (pagination, etc.)
}