package com.fos.orderservice.service;

import com.fos.orderservice.dto.*;
import com.fos.orderservice.exception.OrderNotFoundException;
import com.fos.orderservice.exception.UserNotFoundException;
import com.fos.orderservice.exception.MenuItemNotFoundException;
import com.fos.orderservice.model.Order;
import com.fos.orderservice.model.OrderItem;
import com.fos.orderservice.model.OrderStatus;
import com.fos.orderservice.repository.OrderRepository;
import com.fos.orderservice.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${services.user-service.url}")
    private String userServiceUrl;

    @Value("${services.menu-service.url}")
    private String menuServiceUrl;

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO) {
        // Validate user exists
        UserResponseDTO user = validateUser(orderRequestDTO.getUserId());

        // Validate menu items and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemRequest : orderRequestDTO.getOrderItems()) {
            MenuItemDTO menuItem = validateMenuItem(itemRequest.getMenuItemId());
            BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // Generate order number
        String orderNumber = generateOrderNumber();

        // Create order
        Order order = new Order(
                orderRequestDTO.getUserId(),
                orderNumber,
                totalAmount,
                orderRequestDTO.getDeliveryAddress(),
                orderRequestDTO.getPhoneNumber()
        );

        order.setSpecialInstructions(orderRequestDTO.getSpecialInstructions());
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(30)); // Default 30 minutes

        order = orderRepository.save(order);

        // Create order items
        for (OrderItemRequestDTO itemRequest : orderRequestDTO.getOrderItems()) {
            MenuItemDTO menuItem = getMenuItem(itemRequest.getMenuItemId());

            OrderItem orderItem = new OrderItem(
                    order,
                    itemRequest.getMenuItemId(),
                    menuItem.getName(),
                    itemRequest.getQuantity(),
                    menuItem.getPrice()
            );

            orderItemRepository.save(orderItem);
        }

        return convertToOrderResponseDTO(order);
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        return convertToOrderResponseDTO(order);
    }

    @Override
    public OrderResponseDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with order number: " + orderNumber));
        return convertToOrderResponseDTO(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(this::convertToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByStatusOrderByCreatedAtAsc(status);
        return orders.stream()
                .map(this::convertToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        order.setStatus(status);
        order = orderRepository.save(order);

        return convertToOrderResponseDTO(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findOrdersByDateRange(startDate, endDate);
        return orders.stream()
                .map(this::convertToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUserIdAndStatus(Long userId, OrderStatus status) {
        List<Order> orders = orderRepository.findByUserIdAndStatus(userId, status);
        return orders.stream()
                .map(this::convertToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Long getTotalOrdersCount() {
        return orderRepository.count();
    }

    @Override
    public Double getTotalRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        Double revenue = orderRepository.getTotalRevenueByDateRange(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }

    @Override
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.CONFIRMED) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        } else {
            throw new IllegalStateException("Cannot cancel order with status: " + order.getStatus());
        }
    }

    // Helper methods
    private UserResponseDTO validateUser(Long userId) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri(userServiceUrl + "/" + userId)
                    .retrieve()
                    .bodyToMono(UserResponseDTO.class)
                    .block();
        } catch (Exception e) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
    }

    private MenuItemDTO validateMenuItem(Long menuItemId) {
        try {
            MenuItemDTO menuItem = webClientBuilder.build()
                    .get()
                    .uri(menuServiceUrl + "/items/" + menuItemId)
                    .retrieve()
                    .bodyToMono(MenuItemDTO.class)
                    .block();

            if (menuItem == null || !menuItem.getIsAvailable()) {
                throw new MenuItemNotFoundException("Menu item not available with id: " + menuItemId);
            }

            return menuItem;
        } catch (Exception e) {
            throw new MenuItemNotFoundException("Menu item not found with id: " + menuItemId);
        }
    }

    private MenuItemDTO getMenuItem(Long menuItemId) {
        return webClientBuilder.build()
                .get()
                .uri(menuServiceUrl + "/items/" + menuItemId)
                .retrieve()
                .bodyToMono(MenuItemDTO.class)
                .block();
    }

    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis();
    }

    private OrderResponseDTO convertToOrderResponseDTO(Order order) {
        List<OrderItemResponseDTO> orderItems = orderItemRepository.findByOrderId(order.getId())
                .stream()
                .map(this::convertToOrderItemResponseDTO)
                .collect(Collectors.toList());

        return new OrderResponseDTO(
                order.getId(),
                order.getUserId(),
                order.getOrderNumber(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderType(),
                order.getDeliveryAddress(),
                order.getPhoneNumber(),
                order.getSpecialInstructions(),
                order.getEstimatedDeliveryTime(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                orderItems
        );
    }

    private OrderItemResponseDTO convertToOrderItemResponseDTO(OrderItem orderItem) {
        return new OrderItemResponseDTO(
                orderItem.getId(),
                orderItem.getMenuItemId(),
                orderItem.getMenuItemName(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getTotalPrice(),
                orderItem.getCreatedAt()
        );
    }
}