package com.abs.backend.controller;

import com.abs.backend.dto.CategoryResponse;
import com.abs.backend.dto.CategoryUpdateRequest;
import com.abs.backend.entity.Category;

import com.abs.backend.repository.CategoryRepository;

import com.abs.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;

import com.abs.backend.dto.CategoryRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/categories")

@RequiredArgsConstructor

@CrossOrigin

public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/active")
    public List<CategoryResponse> getActiveCategories() {
        return categoryService.getActiveCategories();
    }

    @PostMapping
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {

        Category category = categoryService.createCategory(request.getName());

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.isActive()
        );
    }

    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryUpdateRequest request) {

        Category updated = categoryService.updateCategory(
                id,
                request.getName(),
                request.isActive()
        );

        return new CategoryResponse(
                updated.getId(),
                updated.getName(),
                updated.isActive()
        );
    }

    @PatchMapping("/{id}/deactivate")
    public void deactivateCategory(@PathVariable Long id) {
        categoryService.deactivateCategory(id);
    }

    @PatchMapping("/{id}/activate")
    public void activateCategory(@PathVariable Long id) {
        categoryService.activateCategory(id);
    }

}