package com.abs.backend.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String errorCode;
    private String message;
}