package com.abs.backend.controller;

import com.abs.backend.entity.Category;

import com.abs.backend.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/categories")

@RequiredArgsConstructor

@CrossOrigin

public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping

    public List<Category> getAllCategories() {

        return categoryRepository.findAll();

    }

}