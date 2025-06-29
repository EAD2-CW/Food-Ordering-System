package com.fos.orderservice.model;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PREPARING,
    READY,
    DISPATCHED,
    DELIVERED,
    CANCELLED
}