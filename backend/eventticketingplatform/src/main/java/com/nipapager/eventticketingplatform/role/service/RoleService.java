package com.nipapager.eventticketingplatform.role.service;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.role.dto.RoleDTO;

import java.util.List;

/**
 * Service interface for Role operations
 */
public interface RoleService {

    Response<RoleDTO> createRole(UserRole roleName);

    Response<List<RoleDTO>> getAllRoles();

    Response<RoleDTO> getRoleByName(UserRole roleName);
}