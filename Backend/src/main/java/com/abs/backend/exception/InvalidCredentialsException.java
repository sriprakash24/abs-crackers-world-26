package com.abs.backend.exception;

public class InvalidCredentialsException extends BusinessException {

    public InvalidCredentialsException() {
        super(ErrorCode.INVALID_CREDENTIALS,
                "Invalid phone number or password");
    }
}