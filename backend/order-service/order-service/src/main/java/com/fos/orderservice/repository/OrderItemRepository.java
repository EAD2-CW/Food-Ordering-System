package com.fos.orderservice.repository;

import com.fos.orderservice.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.menuItemId = :menuItemId")
    List<OrderItem> findByMenuItemId(@Param("menuItemId") Long menuItemId);

    @Query("SELECT oi.menuItemId, SUM(oi.quantity) FROM OrderItem oi " +
            "JOIN oi.order o WHERE o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY oi.menuItemId ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findMostOrderedItems(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(oi.totalPrice) FROM OrderItem oi WHERE oi.order.id = :orderId")
    Double getTotalAmountByOrderId(@Param("orderId") Long orderId);
}