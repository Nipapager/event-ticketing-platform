package com.nipapager.eventticketingplatform.user.service;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.notification.service.NotificationService;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.role.entity.Role;
import com.nipapager.eventticketingplatform.role.repository.RoleRepository;
import com.nipapager.eventticketingplatform.user.dto.UserDTO;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final NotificationService notificationService;

    @Override
    public Response<List<UserDTO>> getAllUsers() {
        log.info("Admin fetching all users");

        List<User> users = userRepository.findAll();

        List<UserDTO> userDTOs = users.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return Response.<List<UserDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Users retrieved successfully")
                .data(userDTOs)
                .build();
    }

    @Override
    @Transactional
    public Response<UserDTO> promoteToOrganizer(Long userId) {
        log.info("Promoting user {} to organizer", userId);

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        // Check if already organizer
        boolean isOrganizer = user.getRoles().stream()
                .anyMatch(role -> role.getName() == UserRole.ROLE_ORGANIZER);

        if (isOrganizer) {
            throw new BadRequestException("User is already an organizer");
        }

        // Get ORGANIZER role
        Role organizerRole = roleRepository.findByName(UserRole.ROLE_ORGANIZER)
                .orElseThrow(() -> new NotFoundException("Organizer role not found"));

        // Add organizer role
        user.getRoles().add(organizerRole);
        User updatedUser = userRepository.save(user);

        log.info("User {} promoted to organizer successfully", userId);

        notificationService.sendOrganizerUpgradeEmail(user);

        UserDTO userDTO = mapToDTO(updatedUser);

        return Response.<UserDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User promoted to organizer successfully")
                .data(userDTO)
                .build();
    }

    @Override
    @Transactional
    public Response<Void> deleteUser(Long userId) {
        log.info("Admin deleting user {}", userId);

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        // Prevent deleting current admin
        User currentUser = userService.getCurrentLoggedInUser();
        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("Cannot delete your own account");
        }

        // Delete user
        userRepository.delete(user);
        log.info("User {} deleted successfully", userId);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User deleted successfully")
                .build();
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = modelMapper.map(user, UserDTO.class);

        // Map roles
        List<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());
        dto.setRoles(roleNames);

        return dto;
    }

    @Override
    @Transactional
    public Response<UserDTO> demoteFromOrganizer(Long userId) {
        log.info("Demoting user {} from organizer", userId);

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        // Check if user is organizer
        boolean isOrganizer = user.getRoles().stream()
                .anyMatch(role -> role.getName() == UserRole.ROLE_ORGANIZER);

        if (!isOrganizer) {
            throw new BadRequestException("User is not an organizer");
        }

        // Get ORGANIZER role
        Role organizerRole = roleRepository.findByName(UserRole.ROLE_ORGANIZER)
                .orElseThrow(() -> new NotFoundException("Organizer role not found"));

        // Remove organizer role
        user.getRoles().remove(organizerRole);
        User updatedUser = userRepository.save(user);

        log.info("User {} demoted from organizer successfully", userId);

        UserDTO userDTO = mapToDTO(updatedUser);

        return Response.<UserDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User demoted from organizer successfully")
                .data(userDTO)
                .build();
    }
}