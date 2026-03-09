package com.abs.backend.controller;

import com.abs.backend.entity.Product;

import com.abs.backend.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/admin/products")

@RequiredArgsConstructor

public class AdminProductController {

    private final ProductRepository productRepository;

    // CREATE PRODUCT

    @PostMapping

    public Product createProduct(@RequestBody Product product) {

        return productRepository.save(product);

    }

    // GET ALL PRODUCTS

    @GetMapping

    public List<Product> getAllProducts() {

        return productRepository.findAll();

    }

    // UPDATE PRODUCT

    @PutMapping("/{id}")

    public Product updateProduct(@PathVariable Long id,

                                 @RequestBody Product updatedProduct) {

        Product product = productRepository.findById(id)

                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(updatedProduct.getName());

        product.setMrp(updatedProduct.getMrp());

        product.setRetailDiscountPercent(updatedProduct.getRetailDiscountPercent());

        product.setStockBoxes(updatedProduct.getStockBoxes());

        product.setImageUrl(updatedProduct.getImageUrl());

        return productRepository.save(product);

    }

    // DELETE PRODUCT

    @DeleteMapping("/{id}")

    public String deleteProduct(@PathVariable Long id) {

        productRepository.deleteById(id);

        return "Product deleted successfully";

    }

}