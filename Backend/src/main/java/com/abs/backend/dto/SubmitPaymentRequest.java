package com.abs.backend.dto;

import lombok.Data;

@Data
public class SubmitPaymentRequest {
    private String paymentReference;  // UTR number
}