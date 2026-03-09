package com.abs.backend.entity;

public enum OrderStatus {

    PLACED,            // User created order
    PAYMENT_PENDING,   // Waiting for UPI screenshot
    PAYMENT_VERIFIED,  // Admin approved payment
    PROCESSING,
    PACKING,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    PARTIALLY_PACKED,
    READY_TO_SHIP,
}