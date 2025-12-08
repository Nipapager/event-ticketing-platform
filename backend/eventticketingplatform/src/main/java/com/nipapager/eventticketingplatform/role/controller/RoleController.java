package com.nipapager.eventticketingplatform.role.controller;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.role.dto.RoleDTO;
import com.nipapager.eventticketingplatform.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<RoleDTO>> createRole(@RequestParam UserRole roleName) {
        Response<RoleDTO> response = roleService.createRole(roleName);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping
    public ResponseEntity<Response<List<RoleDTO>>> getAllRoles() {
        Response<List<RoleDTO>> response = roleService.getAllRoles();
        return ResponseEntity.ok(response);
    }

}
