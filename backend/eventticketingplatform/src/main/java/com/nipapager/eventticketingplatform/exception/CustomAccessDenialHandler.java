package com.nipapager.eventticketingplatform.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nipapager.eventticketingplatform.response.Response;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Custom access denied handler
 * Handles authorization failures (403 Forbidden)
 */
@Component
@RequiredArgsConstructor
public class CustomAccessDenialHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException, ServletException {

        // Build error response
        Response<?> errorResponse = Response.builder()
                .statusCode(HttpStatus.FORBIDDEN.value())
                .message("Access denied: " + accessDeniedException.getMessage())
                .build();

        // Set response properties
        response.setContentType("application/json");
        response.setStatus(HttpStatus.FORBIDDEN.value());

        // Write JSON response
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}