package com.nipapager.eventticketingplatform.payment.service;

import com.nipapager.eventticketingplatform.enums.EventStatus;
import com.nipapager.eventticketingplatform.enums.OrderStatus;
import com.nipapager.eventticketingplatform.enums.PaymentMethod;
import com.nipapager.eventticketingplatform.enums.PaymentStatus;
import com.nipapager.eventticketingplatform.event.entity.Event;
import com.nipapager.eventticketingplatform.event.entity.TicketType;
import com.nipapager.eventticketingplatform.event.repository.EventRepository;
import com.nipapager.eventticketingplatform.event.repository.TicketTypeRepository;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.notification.service.NotificationService;
import com.nipapager.eventticketingplatform.order.entity.Order;
import com.nipapager.eventticketingplatform.order.entity.OrderItem;
import com.nipapager.eventticketingplatform.order.repository.OrderRepository;
import com.nipapager.eventticketingplatform.payment.dto.CheckoutResponse;
import com.nipapager.eventticketingplatform.payment.dto.CreateCheckoutRequest;
import com.nipapager.eventticketingplatform.payment.entity.Payment;
import com.nipapager.eventticketingplatform.payment.repository.PaymentRepository;
import com.nipapager.eventticketingplatform.qrcode.service.QRCodeService;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.service.UserService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final PaymentRepository paymentRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final QRCodeService qrCodeService;  // ADD THIS

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    @Override
    @Transactional
    public Response<CheckoutResponse> createCheckoutSession(CreateCheckoutRequest request) {
        log.info("Creating Stripe checkout session for event: {}", request.getEventId());

        try {
            // Get current user
            User user = userService.getCurrentLoggedInUser();

            // Find event
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new NotFoundException("Event not found"));

            // Validate event
            validateEventForBooking(event);

            // Create order in PENDING state
            Order order = Order.builder()
                    .user(user)
                    .event(event)
                    .status(OrderStatus.PENDING)
                    .orderDate(LocalDateTime.now())
                    .build();

            // Build line items for Stripe
            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<OrderItem> orderItems = new ArrayList<>();

            for (CreateCheckoutRequest.CheckoutItemRequest itemRequest : request.getItems()) {
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

                // Reserve tickets (decrease stock)
                ticketType.setQuantityAvailable(ticketType.getQuantityAvailable() - itemRequest.getQuantity());
                ticketTypeRepository.save(ticketType);

                // Add to total
                totalAmount = totalAmount.add(subtotal);

                // Create Stripe line item
                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("eur")
                                        .setUnitAmount(ticketType.getPrice().multiply(new BigDecimal("100")).longValue()) // Convert to cents
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(event.getTitle() + " - " + ticketType.getName())
                                                        .setDescription("Event ticket")
                                                        .build()
                                        )
                                        .build()
                        )
                        .setQuantity((long) itemRequest.getQuantity())
                        .build();

                lineItems.add(lineItem);

                log.info("Added {} x {} tickets to checkout (Price: €{})",
                        itemRequest.getQuantity(), ticketType.getName(), ticketType.getPrice());
            }

            order.setTotalAmount(totalAmount);
            order.setOrderItems(orderItems);

            // Save order temporarily
            Order savedOrder = orderRepository.save(order);

            // Create Stripe checkout session
            Map<String, String> metadata = new HashMap<>();
            metadata.put("orderId", savedOrder.getId().toString());
            metadata.put("userId", user.getId().toString());
            metadata.put("eventId", event.getId().toString());

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl)
                    .addAllLineItem(lineItems)
                    .setCustomerEmail(user.getEmail())
                    .putAllMetadata(metadata)
                    .setExpiresAt(System.currentTimeMillis() / 1000 + 1800) // 30 minutes expiry
                    .build();

            Session session = Session.create(params);

            // Update order with session ID
            savedOrder.setStripeSessionId(session.getId());
            orderRepository.save(savedOrder);

            log.info("Stripe checkout session created: {} for order: {}", session.getId(), savedOrder.getId());

            // Build response
            CheckoutResponse checkoutResponse = CheckoutResponse.builder()
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .orderId(savedOrder.getId())
                    .build();

            return Response.<CheckoutResponse>builder()
                    .statusCode(HttpStatus.OK.value())
                    .message("Checkout session created successfully")
                    .data(checkoutResponse)
                    .build();

        } catch (StripeException e) {
            log.error("Stripe error: {}", e.getMessage());
            throw new BadRequestException("Payment processing error: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        log.info("Received Stripe webhook");

        try {
            com.stripe.model.Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            log.info("Webhook signature verified. Event type: {}", event.getType());

            // Handle checkout.session.completed event
            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElseThrow();
                log.info("Processing checkout session: {}", session.getId());
                log.info("Payment status: {}", session.getPaymentStatus());
                log.info("Session metadata: {}", session.getMetadata());
                handleCheckoutSessionCompleted(session);
            }
            // Handle checkout.session.expired event
            else if ("checkout.session.expired".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElseThrow();
                handleCheckoutSessionExpired(session);
            } else {
                log.info("Unhandled webhook event type: {}", event.getType());
            }

        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed: {}", e.getMessage());
            throw new BadRequestException("Invalid webhook signature");
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            throw new BadRequestException("Webhook processing failed: " + e.getMessage());
        }
    }

    // ========== PRIVATE HELPER METHODS ==========

    private void handleCheckoutSessionCompleted(Session session) {
        log.info("Processing completed checkout session: {}", session.getId());

        try {
            String sessionId = session.getId();

            log.info("Looking for order with session ID: {}", sessionId);
            Order order = orderRepository.findByStripeSessionId(sessionId)
                    .orElseThrow(() -> {
                        log.error("Order not found for session: {}", sessionId);
                        return new NotFoundException("Order not found for session: " + sessionId);
                    });

            log.info("Found order: {} (Status: {})", order.getId(), order.getStatus());

            if (order.getStatus() != OrderStatus.PENDING) {
                log.warn("Order {} already processed (Status: {})", order.getId(), order.getStatus());
                return;
            }

            // Update order status to CONFIRMED
            order.setStatus(OrderStatus.CONFIRMED);
            order.setUpdatedAt(LocalDateTime.now());
            log.info("Order {} status updated to CONFIRMED", order.getId());

            // Generate QR codes for tickets
            log.info("Generating QR codes for {} order items", order.getOrderItems().size());
            for (OrderItem orderItem : order.getOrderItems()) {
                // Generate unique ticket code
                String ticketCode = qrCodeService.generateTicketCode(order.getId(), orderItem.getId());

                // Generate QR code with ticket information
                String qrData = String.format(
                        "TICKET:%s|EVENT:%s|USER:%s|DATE:%s|VENUE:%s",
                        ticketCode,
                        order.getEvent().getTitle(),
                        order.getUser().getEmail(),
                        order.getEvent().getEventDate(),
                        order.getEvent().getVenue().getName()
                );

                String qrCodeBase64 = qrCodeService.generateQRCodeBase64(qrData);

                // Update order item
                orderItem.setTicketCode(ticketCode);
                orderItem.setQrCodeUrl(qrCodeBase64);
                orderItem.setIsValid(true);

                log.info("Generated QR code for ticket: {} (Item ID: {})", ticketCode, orderItem.getId());
            }

            orderRepository.save(order);
            log.info("Order {} saved with QR codes", order.getId());

            // Create payment record
            Payment payment = Payment.builder()
                    .user(order.getUser())
                    .order(order)
                    .amount(order.getTotalAmount())
                    .status(PaymentStatus.COMPLETED)
                    .transactionId(session.getPaymentIntent())
                    .paymentMethod(PaymentMethod.CREDIT_CARD)
                    .paymentDate(LocalDateTime.now())
                    .build();

            paymentRepository.save(payment);
            log.info("Payment record created for order {}", order.getId());

            // Send ticket purchase email (with QR codes)
            try {
                notificationService.sendTicketPurchaseEmail(order);
                log.info("Confirmation email sent to: {}", order.getUser().getEmail());
            } catch (Exception e) {
                log.error("Failed to send confirmation email: {}", e.getMessage());
            }

            log.info("Order {} confirmed successfully via Stripe payment", order.getId());

        } catch (Exception e) {
            log.error("Error in handleCheckoutSessionCompleted: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void handleCheckoutSessionExpired(Session session) {
        log.info("Processing expired checkout session: {}", session.getId());

        String sessionId = session.getId();
        Order order = orderRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new NotFoundException("Order not found for session: " + sessionId));

        // Cancel order and restore tickets
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setUpdatedAt(LocalDateTime.now());

            // Restore ticket quantities
            for (OrderItem orderItem : order.getOrderItems()) {
                TicketType ticketType = orderItem.getTicketType();
                ticketType.setQuantityAvailable(
                        ticketType.getQuantityAvailable() + orderItem.getQuantity()
                );
                ticketTypeRepository.save(ticketType);

                log.info("Restored {} tickets for: {}", orderItem.getQuantity(), ticketType.getName());
            }

            orderRepository.save(order);
            log.info("Order {} cancelled due to expired Stripe session", order.getId());
        }
    }

    private void validateEventForBooking(Event event) {
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new BadRequestException("Event is not available for booking");
        }

        if (event.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book tickets for past event");
        }
    }
}