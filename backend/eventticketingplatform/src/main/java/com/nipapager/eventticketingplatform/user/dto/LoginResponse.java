package com.nipapager.eventticketingplatform.user.dto;

import lombok.Data;

import java.util.List;

/**
 * DTO for login response
 * Contains JWT token and user roles after successful authentication
 */
@Data
public class LoginResponse {

    private String token;
    private List<String> roles;
}