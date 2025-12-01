package com.nipapager.eventticketingplatform.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for User entity
 * Used for transferring user data between client and server
 * Password is write-only (excluded from GET responses)
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String profileUrl;
    private String address;
    private Boolean isActive;
    private List<String> roles;

    // Write-only: Included when receiving data, excluded when sending data
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // For profile image upload
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private MultipartFile imageFile;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}