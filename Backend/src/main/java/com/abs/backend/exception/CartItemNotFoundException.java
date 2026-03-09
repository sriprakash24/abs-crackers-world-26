package com.abs.backend.exception;

public class CartItemNotFoundException extends BusinessException {

    public CartItemNotFoundException() {
        super(ErrorCode.CART_ITEM_NOT_FOUND,
                "Item not found in cart");
    }
}