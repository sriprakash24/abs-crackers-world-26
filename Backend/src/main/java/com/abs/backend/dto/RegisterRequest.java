package com.abs.backend.dto;

import com.abs.backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String phone;
    private String password;
    private Role role;
}