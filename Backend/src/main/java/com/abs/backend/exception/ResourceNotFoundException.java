package com.abs.backend.exception;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String resource) {
        super(ErrorCode.PRODUCT_NOT_FOUND,
                resource + " not found");
    }

    // ✅ NEW (for Category and future modules)
    public ResourceNotFoundException(ErrorCode errorCode, String resource) {
        super(errorCode, resource + " not found");
    }
}