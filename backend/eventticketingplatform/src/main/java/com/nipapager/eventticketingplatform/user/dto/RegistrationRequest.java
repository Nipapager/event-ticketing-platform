package com.nipapager.eventticketingplatform.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/**
 * DTO for user registration requests
 * Contains all required information for creating a new user account
 */
@Data
public class RegistrationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Wrong format. Use a valid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 3, message = "Password must have at least 3 characters")
    private String password;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private List<String> roles;  // Optional, defaults to ROLE_USER if not provided
}