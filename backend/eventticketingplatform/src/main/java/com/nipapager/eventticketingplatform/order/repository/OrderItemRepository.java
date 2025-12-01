package com.nipapager.eventticketingplatform.order.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for OrderItem entity
 * Provides database operations for order items
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}