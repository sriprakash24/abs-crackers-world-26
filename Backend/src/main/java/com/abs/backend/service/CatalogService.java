package com.abs.backend.service;

import com.abs.backend.entity.Product;
import com.abs.backend.entity.Role;
import com.abs.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final ProductRepository productRepository;
    private final ProductPricingService productPricingService;

    public Map<String, List<Map<String, Object>>> buildCatalog(Role role) {

        List<Product> products = productRepository.findAll()
                .stream()
                .filter(Product::getActive)
                .sorted(Comparator.comparing(p -> p.getCategory().getId()))
                .toList();

        Map<String, List<Map<String, Object>>> result = new LinkedHashMap<>();

        for (Product p : products) {

            String category = p.getCategory().getName();

            BigDecimal price = productPricingService.calculatePrice(p, role);

            Map<String, Object> productMap = new HashMap<>();

            productMap.put("name", p.getName());
            productMap.put("mrp", p.getMrp());

            // IMPORTANT: absolute image URL
            productMap.put("image", p.getImageUrl());

            productMap.put("price", price);

            result.computeIfAbsent(category, k -> new ArrayList<>()).add(productMap);
        }

        return result;
    }
}