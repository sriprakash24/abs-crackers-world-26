package com.abs.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {

    private Long productId;
    private String productName;
    private String imageUrl;
    private Double mrp;
    private Double sellingPrice;
    private Integer quantity;
    private Double totalPrice;
}