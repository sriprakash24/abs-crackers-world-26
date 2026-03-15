package com.abs.backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {

    private String name;
    private String email;

}