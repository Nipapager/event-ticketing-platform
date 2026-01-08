package com.nipapager.eventticketingplatform.order.controller;

import com.nipapager.eventticketingplatform.order.dto.OrderDTO;
import com.nipapager.eventticketingplatform.order.service.OrderService;
import com.nipapager.eventticketingplatform.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    /**
     * Get all orders (Admin only)
     * GET /api/admin/orders
     */
    @GetMapping
    public ResponseEntity<Response<List<OrderDTO>>> getAllOrders() {
        log.info("Admin fetching all orders");
        Response<List<OrderDTO>> response = orderService.getAllOrders();
        return ResponseEntity.ok(response);
    }

    /**
     * Refund an order (Admin only)
     * PUT /api/admin/orders/{id}/refund
     */
    @PutMapping("/{id}/refund")
    public ResponseEntity<Response<OrderDTO>> refundOrder(@PathVariable Long id) {
        log.info("Admin processing refund for order: {}", id);
        Response<OrderDTO> response = orderService.refundOrder(id);
        return ResponseEntity.ok(response);
    }
}