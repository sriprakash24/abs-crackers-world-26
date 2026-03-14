package com.abs.backend.service;

import com.abs.backend.dto.ProductResponse;
import com.abs.backend.entity.Product;
import com.abs.backend.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductMapper {

    private final ProductPricingService pricingService;
    private final StockService stockService;

    public ProductResponse toResponse(Product product, Role role) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory().getName())
                .mrp(product.getMrp())
                .sellingPrice(pricingService.calculatePrice(product, role))
                .stockStatus(stockService.getStockStatus(product))
                .imageUrl(product.getImageUrl())
                .stock(product.getStockBoxes())
                .build();
    }
}