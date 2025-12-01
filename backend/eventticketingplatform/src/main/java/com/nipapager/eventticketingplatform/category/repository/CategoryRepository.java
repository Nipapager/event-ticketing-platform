package com.nipapager.eventticketingplatform.category.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Category entity
 * Provides database operations for categories
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}