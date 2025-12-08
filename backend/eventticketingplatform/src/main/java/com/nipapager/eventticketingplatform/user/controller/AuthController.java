package com.nipapager.eventticketingplatform.user.controller;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.LoginRequest;
import com.nipapager.eventticketingplatform.user.dto.LoginResponse;
import com.nipapager.eventticketingplatform.user.dto.RegistrationRequest;
import com.nipapager.eventticketingplatform.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Response<LoginResponse>> register(
            @Valid @RequestBody RegistrationRequest request) {

        Response<LoginResponse> response = authService.register(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        Response<LoginResponse> response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}