package com.abs.backend.exception;

public class ValidationException extends BusinessException {

    public ValidationException(String message) {
        super(ErrorCode.VALIDATION_ERROR, message);
    }
}