package com.fos.orderservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fos.orderservice.dto.OrderItemRequestDTO;
import com.fos.orderservice.dto.OrderRequestDTO;
import com.fos.orderservice.dto.OrderResponseDTO;
import com.fos.orderservice.model.OrderStatus;
import com.fos.orderservice.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    private OrderRequestDTO orderRequestDTO;
    private OrderResponseDTO orderResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup test data
        OrderItemRequestDTO orderItem = new OrderItemRequestDTO(1L, 2);

        orderRequestDTO = new OrderRequestDTO(
                1L,
                "123 Main St, City",
                "123-456-7890",
                "Please ring doorbell",
                Arrays.asList(orderItem)
        );

        orderResponseDTO = new OrderResponseDTO(
                1L,
                1L,
                "ORD123456789",
                new BigDecimal("25.99"),
                OrderStatus.PENDING,
                null,
                "123 Main St, City",
                "123-456-7890",
                "Please ring doorbell",
                LocalDateTime.now().plusMinutes(30),
                LocalDateTime.now(),
                LocalDateTime.now(),
                null
        );
    }

    @Test
    void createOrder_ShouldReturnCreatedOrder() throws Exception {
        when(orderService.createOrder(any(OrderRequestDTO.class))).thenReturn(orderResponseDTO);

        mockMvc.perform(post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.orderNumber").value("ORD123456789"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getOrderById_ShouldReturnOrder() throws Exception {
        when(orderService.getOrderById(anyLong())).thenReturn(orderResponseDTO);

        mockMvc.perform(get("/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.orderNumber").value("ORD123456789"));
    }

    @Test
    void getOrdersByUserId_ShouldReturnUserOrders() throws Exception {
        List<OrderResponseDTO> orders = Arrays.asList(orderResponseDTO);
        when(orderService.getOrdersByUserId(anyLong())).thenReturn(orders);

        mockMvc.perform(get("/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void updateOrderStatus_ShouldReturnUpdatedOrder() throws Exception {
        OrderResponseDTO updatedOrder = orderResponseDTO;
        updatedOrder.setStatus(OrderStatus.CONFIRMED);

        when(orderService.updateOrderStatus(anyLong(), any(OrderStatus.class))).thenReturn(updatedOrder);

        mockMvc.perform(put("/1/status")
                        .param("status", "CONFIRMED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void createOrder_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        OrderRequestDTO invalidRequest = new OrderRequestDTO();
        invalidRequest.setUserId(null); // Invalid - required field

        mockMvc.perform(post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}