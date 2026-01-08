package com.nipapager.eventticketingplatform.order.service;

import com.nipapager.eventticketingplatform.enums.EventStatus;
import com.nipapager.eventticketingplatform.enums.OrderStatus;
import com.nipapager.eventticketingplatform.enums.PaymentStatus;
import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.event.entity.Event;
import com.nipapager.eventticketingplatform.event.entity.TicketType;
import com.nipapager.eventticketingplatform.event.repository.EventRepository;
import com.nipapager.eventticketingplatform.event.repository.TicketTypeRepository;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.ForbiddenException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.notification.service.NotificationService;
import com.nipapager.eventticketingplatform.order.dto.OrderDTO;
import com.nipapager.eventticketingplatform.order.dto.OrderItemDTO;
import com.nipapager.eventticketingplatform.order.entity.Order;
import com.nipapager.eventticketingplatform.order.entity.OrderItem;
import com.nipapager.eventticketingplatform.order.repository.OrderRepository;
import com.nipapager.eventticketingplatform.order.request.OrderRequest;
import com.nipapager.eventticketingplatform.payment.entity.Payment;
import com.nipapager.eventticketingplatform.payment.repository.PaymentRepository;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for order operations
 * Handles business logic for order management and ticket booking
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public Response<OrderDTO> createOrder(OrderRequest orderRequest) {
        log.info("Creating order for event: {}", orderRequest.getEventId());

        // Get current user
        User user = userService.getCurrentLoggedInUser();

        // Find event
        Event event = eventRepository.findById(orderRequest.getEventId())
                .orElseThrow(() -> new NotFoundException("Event not found"));

        // Validate event
        validateEventForBooking(event);

        // Create order
        Order order = Order.builder()
                .user(user)
                .event(event)
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();

        // Calculate total and create order items
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
            // Find ticket type
            TicketType ticketType = ticketTypeRepository.findById(itemRequest.getTicketTypeId())
                    .orElseThrow(() -> new NotFoundException("Ticket type not found"));

            // Validate ticket type belongs to event
            if (!ticketType.getEvent().getId().equals(event.getId())) {
                throw new BadRequestException("Ticket type does not belong to this event");
            }

            // Validate quantity available
            if (ticketType.getQuantityAvailable() < itemRequest.getQuantity()) {
                throw new BadRequestException("Not enough tickets available for: " + ticketType.getName());
            }

            // Calculate subtotal
            BigDecimal subtotal = ticketType.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            // Create order item
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .ticketType(ticketType)
                    .quantity(itemRequest.getQuantity())
                    .pricePerTicket(ticketType.getPrice())
                    .build();

            orderItems.add(orderItem);

            // Update ticket quantity (DECREASE stock)
            ticketType.setQuantityAvailable(ticketType.getQuantityAvailable() - itemRequest.getQuantity());
            ticketTypeRepository.save(ticketType);

            // Add to total
            totalAmount = totalAmount.add(subtotal);

            log.info("Added {} x {} tickets to order (Price: {})",
                    itemRequest.getQuantity(), ticketType.getName(), ticketType.getPrice());
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        // Save order (cascade will save order items)
        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully with ID: {} (Total: {})", savedOrder.getId(), totalAmount);

        // Map to DTO
        OrderDTO orderDTO = mapToDTO(savedOrder);

        return Response.<OrderDTO>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Order created successfully")
                .data(orderDTO)
                .build();
    }

    @Override
    public Response<List<OrderDTO>> getMyOrders() {
        log.info("Fetching orders for current user");

        // Get current user
        User user = userService.getCurrentLoggedInUser();

        // Find all orders by user
        List<Order> orders = orderRepository.findByUserId(user.getId());

        // Map to DTOs
        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return Response.<List<OrderDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Your orders retrieved successfully")
                .data(orderDTOs)
                .build();
    }

    @Override
    public Response<OrderDTO> getOrderById(Long id) {
        log.info("Fetching order with id: {}", id);

        // Find order
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkOrderAccess(order, currentUser);

        // Map to DTO
        OrderDTO orderDTO = mapToDTO(order);

        return Response.<OrderDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Order retrieved successfully")
                .data(orderDTO)
                .build();
    }

    @Override
    @Transactional
    public Response<OrderDTO> confirmOrder(Long id) {
        log.info("Confirming order with id: {}", id);

        // Find order
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkOrderAccess(order, currentUser);

        // Validate order can be confirmed
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Only pending orders can be confirmed");
        }

        // Confirm order
        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        log.info("Order confirmed successfully: {}", id);

        // Map to DTO
        OrderDTO orderDTO = mapToDTO(savedOrder);

        return Response.<OrderDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Order confirmed successfully")
                .data(orderDTO)
                .build();
    }

    @Override
    @Transactional
    public Response<OrderDTO> cancelOrder(Long id) {
        log.info("Cancelling order with id: {}", id);

        // Find order
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        checkOrderAccess(order, currentUser);

        // Validate order can be cancelled
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }
        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel completed order");
        }

        // Restore ticket quantities
        for (OrderItem orderItem : order.getOrderItems()) {
            TicketType ticketType = orderItem.getTicketType();
            ticketType.setQuantityAvailable(
                    ticketType.getQuantityAvailable() + orderItem.getQuantity()
            );
            ticketTypeRepository.save(ticketType);

            log.info("Restored {} tickets for: {}",
                    orderItem.getQuantity(), ticketType.getName());
        }

        // Cancel order
        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        log.info("Order cancelled successfully: {}", id);

        // Map to DTO
        OrderDTO orderDTO = mapToDTO(savedOrder);

        return Response.<OrderDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Order cancelled successfully. Tickets have been released.")
                .data(orderDTO)
                .build();
    }

    @Override
    public Response<List<OrderDTO>> getAllOrders() {
        log.info("Fetching all orders for admin");

        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate"));

        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::mapToDTO)
                .toList();

        log.info("Found {} total orders", orderDTOs.size());

        return Response.<List<OrderDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Orders retrieved successfully")
                .data(orderDTOs)
                .build();
    }

    @Override
    public Response<List<OrderDTO>> getOrdersByEventId(Long eventId) {
        log.info("Fetching orders for event: {}", eventId);

        // Validate event exists
        if (!eventRepository.existsById(eventId)) {
            throw new NotFoundException("Event not found");
        }

        // Get orders for event
        List<Order> orders = orderRepository.findByEventId(eventId);

        // Map to DTOs
        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return Response.<List<OrderDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Orders retrieved successfully")
                .data(orderDTOs)
                .build();
    }

    // ========== HELPER METHODS ==========

    /**
     * Map Order entity to OrderDTO
     */
    private OrderDTO mapToDTO(Order order) {
        OrderDTO dto = modelMapper.map(order, OrderDTO.class);

        // Map event details
        dto.setEventId(order.getEvent().getId());
        dto.setEventTitle(order.getEvent().getTitle());
        dto.setEventDate(order.getEvent().getEventDate());

        // Map user details
        dto.setUserId(order.getUser().getId());
        dto.setUserName(order.getUser().getName());
        dto.setUserEmail(order.getUser().getEmail());

        // Map payment status
        Payment payment = paymentRepository.findByOrder(order).orElse(null);
        if (payment != null) {
            dto.setPaymentStatus(payment.getStatus().name());
        } else {
            dto.setPaymentStatus("PENDING");
        }

        // Map order items
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = modelMapper.map(item, OrderItemDTO.class);
                    itemDTO.setOrderId(order.getId());
                    itemDTO.setEventId(order.getEvent().getId());
                    itemDTO.setEventName(order.getEvent().getTitle());
                    itemDTO.setTicketTypeName(item.getTicketType().getName());
                    return itemDTO;
                })
                .toList();

        dto.setOrderItems(itemDTOs);

        return dto;
    }

    /**
     * Map OrderItem entity to OrderItemDTO
     */
    private OrderItemDTO mapOrderItemToDTO(OrderItem orderItem) {
        // ModelMapper handles: id, quantity, pricePerTicket, qrCodeUrl, ticketCode, createdAt
        OrderItemDTO dto = modelMapper.map(orderItem, OrderItemDTO.class);

        // Manually set nested relationship fields
        dto.setOrderId(orderItem.getOrder().getId());
        dto.setEventId(orderItem.getTicketType().getEvent().getId());
        dto.setEventName(orderItem.getTicketType().getEvent().getTitle());
        dto.setTicketTypeName(orderItem.getTicketType().getName());

        return dto;
    }

    /**
     * Validate event is available for booking
     */
    private void validateEventForBooking(Event event) {
        // Event must be approved
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new BadRequestException("Event is not available for booking");
        }

        // Event must be in future
        if (event.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book tickets for past event");
        }
    }

    @Override
    @Transactional
    public Response<OrderDTO> refundOrder(Long id) {
        log.info("Processing refund for order: {}", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Validate order can be refunded
        if (order.getStatus() != OrderStatus.CONFIRMED && order.getStatus() != OrderStatus.COMPLETED) {
            throw new BadRequestException("Only confirmed/completed orders can be refunded");
        }

        // Find payment for this order
        Payment payment = paymentRepository.findByOrder(order)
                .orElseThrow(() -> new NotFoundException("Payment not found for this order"));

        // Check if already refunded
        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new BadRequestException("Order has already been refunded");
        }

        // Update payment status to REFUNDED
        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);
        log.info("Payment {} status updated to REFUNDED", payment.getId());

        // Invalidate all tickets (QR codes won't work)
        for (OrderItem orderItem : order.getOrderItems()) {
            orderItem.setIsValid(false);

            // Restore ticket quantities
            TicketType ticketType = orderItem.getTicketType();
            ticketType.setQuantityAvailable(
                    ticketType.getQuantityAvailable() + orderItem.getQuantity()
            );
            ticketTypeRepository.save(ticketType);

            log.info("Restored {} tickets for: {}", orderItem.getQuantity(), ticketType.getName());
        }

        // Update order timestamp
        order.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        log.info("Order {} refunded successfully by admin", id);

        // Send refund email
        notificationService.sendRefundEmail(savedOrder);

        OrderDTO orderDTO = mapToDTO(savedOrder);

        return Response.<OrderDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Order refunded successfully")
                .data(orderDTO)
                .build();
    }

    /**
     * Check if user has access to view order
     * User can see own orders, admin can see all
     */
    private void checkOrderAccess(Order order, User user) {
        boolean isOwner = order.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName() == UserRole.ROLE_ADMIN);

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You don't have permission to access this order");
        }
    }
}