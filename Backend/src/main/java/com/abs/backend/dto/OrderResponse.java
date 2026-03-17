package com.abs.backend.dto;

import com.abs.backend.entity.OrderStatus;
import com.abs.backend.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long orderId;
    private String orderNumber;

    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;

    private BigDecimal totalAmount;

    private Boolean editable;

    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;

    private String trackingId;
    private String transportName;
    private String shippingSlipPath;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
}