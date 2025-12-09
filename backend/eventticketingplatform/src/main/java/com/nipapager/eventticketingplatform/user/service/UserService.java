package com.nipapager.eventticketingplatform.user.service;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.UserDTO;
import com.nipapager.eventticketingplatform.user.entity.User;

import java.util.List;

/**
 * Service interface for user operations
 */
public interface UserService {

    User getCurrentLoggedInUser();

    Response<UserDTO> getOwnProfile();

    Response<UserDTO> updateOwnProfile(UserDTO userDTO);

    Response<Void> deactivateOwnAccount();

    Response<List<UserDTO>> getAllUsers();
}