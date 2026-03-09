package com.abs.backend.controller;

import com.abs.backend.dto.ProductResponse;
import com.abs.backend.entity.Role;
import com.abs.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Page<ProductResponse> getProducts(
            @RequestParam(required = false) String category,
            Pageable pageable,
            Authentication authentication) {

        return productService.getProducts(category, pageable, authentication);
    }

    @GetMapping("/by-category")
    public List<ProductResponse> getProductsByCategory(
            @RequestParam String category
    ) {

        Role role = Role.ROLE_RETAIL; // public users see retail pricing

        return productService.getProductsByCategory(category, role);

    }
}