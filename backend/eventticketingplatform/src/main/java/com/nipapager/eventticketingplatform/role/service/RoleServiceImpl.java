package com.nipapager.eventticketingplatform.role.service;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.role.dto.RoleDTO;
import com.nipapager.eventticketingplatform.role.entity.Role;
import com.nipapager.eventticketingplatform.role.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    @Override
    public Response<RoleDTO> createRole(UserRole roleName) {
        log.info("Creating role: {}", roleName);

        // Check for duplicate
        if (roleRepository.findByName(roleName).isPresent()) {
            throw new BadRequestException("Role already exists: " + roleName);
        }

        // Build role
        Role role = Role.builder()
                .name(roleName)
                .createdAt(LocalDateTime.now())
                .build();

        // Save
        Role savedRole = roleRepository.save(role);
        log.info("Role created successfully: {}", savedRole.getId());

        // Convert to DTO
        RoleDTO roleDTO = modelMapper.map(savedRole, RoleDTO.class);

        return Response.<RoleDTO>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Role created successfully")
                .data(roleDTO)
                .build();
    }

    @Override
    public Response<List<RoleDTO>> getAllRoles() {
        log.info("Fetching all roles");

        List<Role> roles = roleRepository.findAll();

        List<RoleDTO> roleDTOs = roles.stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .toList();

        return Response.<List<RoleDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Roles retrieved successfully")
                .data(roleDTOs)
                .build();
    }

    @Override
    public Response<RoleDTO> getRoleByName(UserRole roleName) {
        log.info("Fetching role by name: {}", roleName);

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new NotFoundException("Role not found: " + roleName));

        RoleDTO roleDTO = modelMapper.map(role, RoleDTO.class);

        return Response.<RoleDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Role retrieved successfully")
                .data(roleDTO)
                .build();
    }
}