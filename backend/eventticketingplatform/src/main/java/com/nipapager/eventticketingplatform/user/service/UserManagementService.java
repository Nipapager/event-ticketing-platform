package com.nipapager.eventticketingplatform.user.service;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.UserDTO;

import java.util.List;

/**
 * Service interface for user management operations
 */
public interface UserManagementService {
    Response<List<UserDTO>> getAllUsers();
    Response<UserDTO> promoteToOrganizer(Long userId);
    Response<Void> deleteUser(Long userId);
    Response<UserDTO> demoteFromOrganizer(Long userId);
}