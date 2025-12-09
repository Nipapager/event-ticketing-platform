package com.nipapager.eventticketingplatform.user.service;

import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.UserDTO;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public User getCurrentLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        log.info("Getting current logged in user: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Override
    public Response<UserDTO> getOwnProfile() {
        User user = getCurrentLoggedInUser();

        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        // Set roles
        userDTO.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .toList());

        return Response.<UserDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Profile retrieved successfully")
                .data(userDTO)
                .build();
    }

    @Override
    public Response<UserDTO> updateOwnProfile(UserDTO userDTO) {
        User user = getCurrentLoggedInUser();

        log.info("Updating profile for user: {}", user.getEmail());

        // Update allowed fields
        if (userDTO.getName() != null) {
            user.setName(userDTO.getName());
        }
        if (userDTO.getAddress() != null) {
            user.setAddress(userDTO.getAddress());
        }
        if (userDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userDTO.getPhoneNumber());
        }

        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        // Map to DTO with updated data
        UserDTO updatedDTO = modelMapper.map(savedUser, UserDTO.class);
        updatedDTO.setRoles(savedUser.getRoles().stream()
                .map(role -> role.getName().name())
                .toList());

        return Response.<UserDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Profile updated successfully")
                .data(updatedDTO)
                .build();
    }

    @Override
    public Response<Void> deactivateOwnAccount() {
        User user = getCurrentLoggedInUser();

        log.info("Deactivating account for user: {}", user.getEmail());

        user.setIsActive(false);
        userRepository.save(user);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Account deactivated successfully")
                .build();
    }

    @Override
    public Response<List<UserDTO>> getAllUsers() {
        log.info("Fetching all users");

        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        List<UserDTO> userDTOs = users.stream()
                .map(user -> {
                    UserDTO dto = modelMapper.map(user, UserDTO.class);
                    dto.setRoles(user.getRoles().stream()
                            .map(role -> role.getName().name())  // ← FIX: Convert enum to String
                            .toList());
                    return dto;
                })
                .toList();

        return Response.<List<UserDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("All users retrieved successfully")
                .data(userDTOs)
                .build();
    }
}