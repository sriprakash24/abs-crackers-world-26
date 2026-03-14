package com.abs.backend.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String phone;
    private String newPassword;

}