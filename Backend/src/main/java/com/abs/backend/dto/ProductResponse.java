package com.abs.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String category;

    private BigDecimal mrp;

    private BigDecimal sellingPrice;

    private String stockStatus;

    private String imageUrl;
}