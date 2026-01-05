package com.nipapager.eventticketingplatform.payment.service;

import com.nipapager.eventticketingplatform.payment.dto.CheckoutResponse;
import com.nipapager.eventticketingplatform.payment.dto.CreateCheckoutRequest;
import com.nipapager.eventticketingplatform.response.Response;

public interface PaymentService {
    Response<CheckoutResponse> createCheckoutSession(CreateCheckoutRequest request);
    void handleWebhook(String payload, String sigHeader);
}