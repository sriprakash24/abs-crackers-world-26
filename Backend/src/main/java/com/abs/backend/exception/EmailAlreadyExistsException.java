package com.abs.backend.exception;

public class EmailAlreadyExistsException extends BusinessException {

    public EmailAlreadyExistsException() {
        super(ErrorCode.EMAIL_ALREADY_EXISTS,
                "Email already registered");
    }
}