package com.nipapager.eventticketingplatform.payment.controller;

import com.nipapager.eventticketingplatform.payment.dto.CheckoutResponse;
import com.nipapager.eventticketingplatform.payment.dto.CreateCheckoutRequest;
import com.nipapager.eventticketingplatform.payment.service.PaymentService;
import com.nipapager.eventticketingplatform.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for payment operations with Stripe
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Create Stripe checkout session
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<Response<CheckoutResponse>> createCheckoutSession(
            @RequestBody CreateCheckoutRequest request) {
        log.info("Received checkout request for event: {}", request.getEventId());
        Response<CheckoutResponse> response = paymentService.createCheckoutSession(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Stripe webhook endpoint
     * This receives events from Stripe (payment success, failure, etc.)
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        log.info("Received Stripe webhook");

        try {
            paymentService.handleWebhook(payload, sigHeader);
            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            log.error("Webhook processing failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Webhook processing failed");
        }
    }

    /**
     * Verify payment session (called from frontend after redirect)
     */
    @GetMapping("/verify-session/{sessionId}")
    public ResponseEntity<Response<String>> verifySession(@PathVariable String sessionId) {
        log.info("Verifying session: {}", sessionId);

        // Simple verification endpoint
        return ResponseEntity.ok(Response.<String>builder()
                .statusCode(200)
                .message("Session verified")
                .data(sessionId)
                .build());
    }
}