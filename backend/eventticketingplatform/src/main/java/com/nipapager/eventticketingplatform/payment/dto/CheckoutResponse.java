package com.nipapager.eventticketingplatform.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private String sessionId;
    private String sessionUrl;
    private Long orderId;
}