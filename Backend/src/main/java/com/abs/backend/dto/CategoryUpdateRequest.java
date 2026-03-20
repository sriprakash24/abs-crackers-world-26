package com.abs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryUpdateRequest {

    @NotBlank(message = "Category name cannot be empty")
    private String name;

    private boolean active;
}