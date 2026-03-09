package com.abs.backend.exception;

public class InsufficientStockException extends BusinessException {

    public InsufficientStockException(String productName) {
        super(ErrorCode.INSUFFICIENT_STOCK,
                "Insufficient stock for product: " + productName);
    }
}