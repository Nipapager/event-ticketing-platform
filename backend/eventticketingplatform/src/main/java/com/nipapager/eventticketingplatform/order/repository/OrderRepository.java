package com.nipapager.eventticketingplatform.order.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Order entity
 * Provides database operations for orders
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

}