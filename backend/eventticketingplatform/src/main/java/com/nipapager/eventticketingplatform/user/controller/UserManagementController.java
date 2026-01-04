package com.nipapager.eventticketingplatform.user.controller;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.UserDTO;
import com.nipapager.eventticketingplatform.user.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for admin user management operations
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserManagementService userManagementService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<List<UserDTO>>> getAllUsers() {
        Response<List<UserDTO>> response = userManagementService.getAllUsers();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/promote-organizer")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<UserDTO>> promoteToOrganizer(@PathVariable Long userId) {
        Response<UserDTO> response = userManagementService.promoteToOrganizer(userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<Void>> deleteUser(@PathVariable Long userId) {
        Response<Void> response = userManagementService.deleteUser(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/demote-organizer")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<UserDTO>> demoteFromOrganizer(@PathVariable Long userId) {
        Response<UserDTO> response = userManagementService.demoteFromOrganizer(userId);
        return ResponseEntity.ok(response);
    }
}