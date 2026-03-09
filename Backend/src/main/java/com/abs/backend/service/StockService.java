package com.abs.backend.service;

import com.abs.backend.entity.Product;
import org.springframework.stereotype.Service;

@Service
public class StockService {

    public String getStockStatus(Product product) {

        if (!product.getActive()) {
            return "NOT_AVAILABLE";
        }

        if (product.getStockBoxes() == null || product.getStockBoxes() <= 0) {
            return "OUT_OF_STOCK";
        }

        if (product.getStockBoxes() <= product.getLowStockThreshold()) {
            return "LIMITED_STOCK";
        }

        return "AVAILABLE";
    }
}