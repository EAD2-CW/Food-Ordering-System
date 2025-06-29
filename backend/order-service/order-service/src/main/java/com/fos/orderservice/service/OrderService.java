package com.fos.orderservice.service;

import com.fos.orderservice.dto.OrderRequestDTO;
import com.fos.orderservice.dto.OrderResponseDTO;
import com.fos.orderservice.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {

    OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO);

    OrderResponseDTO getOrderById(Long orderId);

    OrderResponseDTO getOrderByOrderNumber(String orderNumber);

    List<OrderResponseDTO> getOrdersByUserId(Long userId);

    List<OrderResponseDTO> getAllOrders();

    List<OrderResponseDTO> getOrdersByStatus(OrderStatus status);

    OrderResponseDTO updateOrderStatus(Long orderId, OrderStatus status);

    List<OrderResponseDTO> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<OrderResponseDTO> getOrdersByUserIdAndStatus(Long userId, OrderStatus status);

    Long getTotalOrdersCount();

    Double getTotalRevenue(LocalDateTime startDate, LocalDateTime endDate);

    void cancelOrder(Long orderId);
}