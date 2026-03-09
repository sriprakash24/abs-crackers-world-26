package com.abs.backend.service;

import com.abs.backend.entity.Product;
import com.abs.backend.entity.Role;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ProductPricingService {

    public BigDecimal calculatePrice(Product product, Role role) {

        BigDecimal mrp = product.getMrp();

        BigDecimal discountPercent;

        if (role == Role.ROLE_WHOLESALE) {
            discountPercent = product.getWholesaleDiscountPercent();
        } else {
            discountPercent = product.getRetailDiscountPercent();
        }

        if (discountPercent == null) {
            discountPercent = BigDecimal.ZERO;
        }

        BigDecimal discountAmount = mrp
                .multiply(discountPercent)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        return mrp.subtract(discountAmount);
    }
}