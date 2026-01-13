package com.nipapager.eventticketingplatform.order.repository;

import com.nipapager.eventticketingplatform.enums.OrderStatus;
import com.nipapager.eventticketingplatform.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Order entity
 * Provides database operations for orders
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders by user
    List<Order> findByUserId(Long userId);

    // Find orders by event
    List<Order> findByEventId(Long eventId);

    // Find order by Stripe
    Optional<Order> findByStripeSessionId(String stripeSessionId);

    List<Order> findByUserIdAndEventId(Long userId, Long eventId);

    // Find orders by user and status
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
}