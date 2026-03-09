package com.abs.backend.exception;

public class UnauthorizedActionException extends BusinessException {

    public UnauthorizedActionException(String message) {
        super(ErrorCode.UNAUTHORIZED_ACTION, message);
    }
}