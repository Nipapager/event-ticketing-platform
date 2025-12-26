package com.nipapager.eventticketingplatform.order.controller;

import com.nipapager.eventticketingplatform.order.dto.OrderDTO;
import com.nipapager.eventticketingplatform.order.request.OrderRequest;
import com.nipapager.eventticketingplatform.order.service.OrderService;
import com.nipapager.eventticketingplatform.response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for order management
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Response<OrderDTO>> createOrder(@RequestBody OrderRequest orderRequest) {
        Response<OrderDTO> response = orderService.createOrder(orderRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<Response<List<OrderDTO>>> getMyOrders() {
        Response<List<OrderDTO>> response = orderService.getMyOrders();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<OrderDTO>> getOrderById(@PathVariable Long id) {
        Response<OrderDTO> response = orderService.getOrderById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Response<OrderDTO>> confirmOrder(@PathVariable Long id) {
        Response<OrderDTO> response = orderService.confirmOrder(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Response<OrderDTO>> cancelOrder(@PathVariable Long id) {
        Response<OrderDTO> response = orderService.cancelOrder(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<List<OrderDTO>>> getAllOrders() {
        Response<List<OrderDTO>> response = orderService.getAllOrders();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')")
    public ResponseEntity<Response<List<OrderDTO>>> getOrdersByEventId(@PathVariable Long eventId) {
        Response<List<OrderDTO>> response = orderService.getOrdersByEventId(eventId);
        return ResponseEntity.ok(response);
    }
}