package com.abs.backend.service;

import com.abs.backend.dto.ProductResponse;
import com.abs.backend.entity.Product;
import com.abs.backend.entity.Role;
import com.abs.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // 🔹 Admin product creation
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // 🔹 Public product listing (role-based pricing)
    public Page<ProductResponse> getProducts(
            String category,
            Pageable pageable,
            Authentication authentication) {

        Role role = extractRole(authentication);

        Page<Product> products;

        if (category != null && !category.isBlank()) {
            products = productRepository
                    .findByCategory_NameAndActiveTrue(category, pageable);
        } else {
            products = productRepository
                    .findByActiveTrue(pageable);
        }

        return products.map(product ->
                productMapper.toResponse(product, role)
        );
    }

    private Role extractRole(Authentication authentication) {
        String authority = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        return Role.valueOf(authority);
    }

    public List<ProductResponse> getProductsByCategory(String categoryName, Role role) {

        Pageable pageable = PageRequest.of(0, 50);

        Page<Product> productPage =

                productRepository.findByCategory_NameAndActiveTrue(categoryName.trim().toUpperCase(), pageable);

        return productPage.getContent()

                .stream()

                .map(product -> productMapper.toResponse(product, role))

                .toList();

    }
}