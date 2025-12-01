package com.nipapager.eventticketingplatform.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for user login requests
 * Contains credentials for authentication
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Wrong email format. Please try a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}