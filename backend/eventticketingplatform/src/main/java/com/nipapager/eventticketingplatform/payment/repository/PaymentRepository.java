package com.nipapager.eventticketingplatform.payment.repository;

import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Payment entity
 * Provides database operations for payments
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

}