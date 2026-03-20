package com.abs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Category name cannot be empty")
    private String name;
}