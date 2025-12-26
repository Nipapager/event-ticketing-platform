package com.nipapager.eventticketingplatform.order.request;

import lombok.Data;

import java.util.List;

/**
 * DTO for creating an order with multiple ticket types
 */
@Data
public class OrderRequest {

    private Long eventId;

    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long ticketTypeId;
        private Integer quantity;
    }
}