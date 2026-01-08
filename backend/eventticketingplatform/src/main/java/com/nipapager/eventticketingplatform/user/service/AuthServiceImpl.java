package com.nipapager.eventticketingplatform.user.service;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.notification.service.NotificationService;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.role.entity.Role;
import com.nipapager.eventticketingplatform.role.repository.RoleRepository;
import com.nipapager.eventticketingplatform.security.JwtUtils;
import com.nipapager.eventticketingplatform.user.dto.LoginRequest;
import com.nipapager.eventticketingplatform.user.dto.LoginResponse;
import com.nipapager.eventticketingplatform.user.dto.RegistrationRequest;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final NotificationService notificationService;

    @Override
    public Response<LoginResponse> register(RegistrationRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Process roles
        List<Role> userRoles = new ArrayList<>();

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            // Custom roles provided
            for (String roleName : request.getRoles()) {
                try {
                    UserRole userRole = UserRole.valueOf(roleName.toUpperCase());
                    Role role = roleRepository.findByName(userRole)
                            .orElseThrow(() -> new NotFoundException("Role not found: " + roleName));
                    userRoles.add(role);
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid role: " + roleName);
                }
            }
        } else {
            // Default to ROLE_USER
            Role defaultRole = roleRepository.findByName(UserRole.ROLE_USER)
                    .orElseThrow(() -> new NotFoundException("Default ROLE_USER not found"));
            userRoles.add(defaultRole);
        }

        // Build user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(userRoles)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        // Save user
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // Send welcome email
        notificationService.sendWelcomeEmail(savedUser);

        // Generate token WITH user details (includes roles, name, userId)
        String token = jwtUtils.generateToken((UserDetails) savedUser);

        // Extract role names
        List<String> roleNames = savedUser.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();

        // Build response
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setRoles(roleNames);

        return Response.<LoginResponse>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("User registered successfully")
                .data(loginResponse)
                .build();
    }

    @Override
    public Response<LoginResponse> login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        // Authenticate with Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // If authentication succeeds, load user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));

        // Check if account is active
        if (!user.getIsActive()) {
            throw new BadRequestException("Account is not active. Please contact support.");
        }

        // Generate token WITH user details (includes roles, name, userId)
        String token = jwtUtils.generateToken((UserDetails) user);
        log.info("Login successful for user: {}", user.getEmail());

        // Extract role names
        List<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();

        // Build response
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setRoles(roleNames);

        return Response.<LoginResponse>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login successful")
                .data(loginResponse)
                .build();
    }
}