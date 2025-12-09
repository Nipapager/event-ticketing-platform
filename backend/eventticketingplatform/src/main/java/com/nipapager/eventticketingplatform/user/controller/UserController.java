package com.nipapager.eventticketingplatform.user.controller;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.UserDTO;
import com.nipapager.eventticketingplatform.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for user operations
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<Response<UserDTO>> getOwnProfile() {
        Response<UserDTO> response = userService.getOwnProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<Response<UserDTO>> updateOwnProfile(@RequestBody UserDTO userDTO) {
        Response<UserDTO> response = userService.updateOwnProfile(userDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deactivate")
    public ResponseEntity<Response<Void>> deactivateOwnAccount() {
        Response<Void> response = userService.deactivateOwnAccount();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<List<UserDTO>>> getAllUsers() {
        Response<List<UserDTO>> response = userService.getAllUsers();
        return ResponseEntity.ok(response);
    }
}