package com.nipapager.eventticketingplatform.user.repository;

import com.nipapager.eventticketingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
/**
 * Repository interface for User entity
 * Provides database operations for users
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByName(String name);

    boolean existsByEmail(String email);
}
