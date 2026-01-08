package com.nipapager.eventticketingplatform.order.service;

import com.nipapager.eventticketingplatform.order.dto.OrderDTO;
import com.nipapager.eventticketingplatform.order.request.OrderRequest;
import com.nipapager.eventticketingplatform.response.Response;

import java.util.List;

/**
 * Service interface for order operations
 */
public interface OrderService {

    Response<OrderDTO> createOrder(OrderRequest orderRequest);

    Response<List<OrderDTO>> getMyOrders();

    Response<OrderDTO> getOrderById(Long id);

    Response<OrderDTO> confirmOrder(Long id);

    Response<OrderDTO> cancelOrder(Long id);

    // Admin: Get all orders
    Response<List<OrderDTO>> getAllOrders();

    // Admin: Get orders by event
    Response<List<OrderDTO>> getOrdersByEventId(Long eventId);

    Response<OrderDTO> refundOrder(Long id);
}