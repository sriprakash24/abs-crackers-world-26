package com.abs.backend.exception;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String resource) {
        super(ErrorCode.PRODUCT_NOT_FOUND,
                resource + " not found");
    }
}