package com.abs.backend.service;

import com.abs.backend.dto.CategoryResponse;
import com.abs.backend.entity.Category;
import com.abs.backend.exception.ErrorCode;
import com.abs.backend.exception.ResourceAlreadyExistsException;
import com.abs.backend.exception.ResourceNotFoundException;
import com.abs.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.isActive()
                ))
                .toList();
    }

    public Category createCategory(String name) {

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ResourceAlreadyExistsException("Category already exists");
        }

        Category category = new Category();
        category.setName(name);
        category.setActive(true); // ✅ FIXED

        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String name, boolean active) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.CATEGORY_NOT_FOUND,
                        "Category"
                ));

        // duplicate check only if name changed
        if (!category.getName().equalsIgnoreCase(name)
                && categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ResourceAlreadyExistsException("Category already exists");
        }

        category.setName(name);
        category.setActive(active);

        return categoryRepository.save(category);
    }

    public void deactivateCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.CATEGORY_NOT_FOUND,
                        "Category"
                ));

        category.setActive(false);

        categoryRepository.save(category);
    }

    public void activateCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.CATEGORY_NOT_FOUND,
                        "Category"
                ));

        category.setActive(true);

        categoryRepository.save(category);
    }
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.isActive()
                ))
                .toList();
    }
}