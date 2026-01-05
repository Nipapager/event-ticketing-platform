package com.nipapager.eventticketingplatform.payment.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateCheckoutRequest {
    private Long eventId;
    private List<CheckoutItemRequest> items;

    @Data
    public static class CheckoutItemRequest {
        private Long ticketTypeId;
        private Integer quantity;
    }
}