package com.fos.orderservice.service;

import com.fos.orderservice.dto.*;
import com.fos.orderservice.exception.OrderNotFoundException;
import com.fos.orderservice.model.Order;
import com.fos.orderservice.model.OrderStatus;
import com.fos.orderservice.repository.OrderRepository;
import com.fos.orderservice.repository.OrderItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order order;
    private OrderRequestDTO orderRequestDTO;

    @BeforeEach
    void setUp() {
        order = new Order(1L, "ORD123456789", new BigDecimal("25.99"), "123 Main St", "123-456-7890");
        order.setId(1L);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        OrderItemRequestDTO orderItem = new OrderItemRequestDTO(1L, 2);
        orderRequestDTO = new OrderRequestDTO(
                1L,
                "123 Main St, City",
                "123-456-7890",
                "Please ring doorbell",
                Arrays.asList(orderItem)
        );
    }

    @Test
    void getOrderById_ExistingOrder_ShouldReturnOrder() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderItemRepository.findByOrderId(1L)).thenReturn(Arrays.asList());

        OrderResponseDTO result = orderService.getOrderById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("ORD123456789", result.getOrderNumber());
        verify(orderRepository).findById(1L);
    }

    @Test
    void getOrderById_NonExistingOrder_ShouldThrowException() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.getOrderById(1L));
        verify(orderRepository).findById(1L);
    }

    @Test
    void updateOrderStatus_ValidOrder_ShouldUpdateStatus() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderItemRepository.findByOrderId(1L)).thenReturn(Arrays.asList());

        OrderResponseDTO result = orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED);

        assertNotNull(result);
        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        verify(orderRepository).save(order);
    }

    @Test
    void cancelOrder_PendingOrder_ShouldCancelSuccessfully() {
        order.setStatus(OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertDoesNotThrow(() -> orderService.cancelOrder(1L));
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        verify(orderRepository).save(order);
    }

    @Test
    void cancelOrder_DeliveredOrder_ShouldThrowException() {
        order.setStatus(OrderStatus.DELIVERED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThrows(IllegalStateException.class, () -> orderService.cancelOrder(1L));
    }

    @Test
    void getTotalOrdersCount_ShouldReturnCount() {
        when(orderRepository.count()).thenReturn(10L);

        Long count = orderService.getTotalOrdersCount();

        assertEquals(10L, count);
        verify(orderRepository).count();
    }

    @Test
    void getTotalRevenue_WithValidDateRange_ShouldReturnRevenue() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();
        when(orderRepository.getTotalRevenueByDateRange(startDate, endDate)).thenReturn(1000.0);

        Double revenue = orderService.getTotalRevenue(startDate, endDate);

        assertEquals(1000.0, revenue);
        verify(orderRepository).getTotalRevenueByDateRange(startDate, endDate);
    }

    @Test
    void getTotalRevenue_WithNullResult_ShouldReturnZero() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();
        when(orderRepository.getTotalRevenueByDateRange(startDate, endDate)).thenReturn(null);

        Double revenue = orderService.getTotalRevenue(startDate, endDate);

        assertEquals(0.0, revenue);
    }
}