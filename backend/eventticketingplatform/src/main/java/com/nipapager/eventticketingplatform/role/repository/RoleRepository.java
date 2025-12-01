package com.nipapager.eventticketingplatform.role.repository;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Role entity
 * Provides database operations for roles
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(UserRole name);
}