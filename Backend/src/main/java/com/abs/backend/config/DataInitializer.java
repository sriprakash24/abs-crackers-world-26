package com.abs.backend.config;

import com.abs.backend.entity.Category;
import com.abs.backend.entity.Product;
import com.abs.backend.repository.CategoryRepository;
import com.abs.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

//@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {

        if (productRepository.count() > 0) {
            return;
        }

        // Fetch categories
        Category sparklers = categoryRepository.findByName("SPARKLERS").orElseThrow();
        Category bombs = categoryRepository.findByName("BOMB").orElseThrow();
        Category flowerPot = categoryRepository.findByName("FLOWER POT").orElseThrow();
        Category rocket = categoryRepository.findByName("ROCKET").orElseThrow();

        productRepository.saveAll(List.of(

                Product.builder()
                        .name("10 CM ELECTRIC SPARKLERS")
                        .category(sparklers)
                        .mrp(new BigDecimal("150"))
                        .retailDiscountPercent(new BigDecimal("80"))
                        .wholesaleDiscountPercent(new BigDecimal("85"))
                        .boxesPerCase(20)
                        .stockBoxes(500)
                        .minWholesaleCases(5)
                        .maxRetailBoxes(10)
                        .allowPartialCase(false)
                        .lowStockThreshold(50)
                        .imageUrl("https://i.postimg.cc/Vk63x2xF/image.png")
                        .active(true)
                        .build(),

                Product.builder()
                        .name("HYDROGEN BOMB")
                        .category(bombs)
                        .mrp(new BigDecimal("750"))
                        .retailDiscountPercent(new BigDecimal("75"))
                        .wholesaleDiscountPercent(new BigDecimal("82"))
                        .boxesPerCase(50)
                        .stockBoxes(200)
                        .minWholesaleCases(3)
                        .maxRetailBoxes(5)
                        .allowPartialCase(false)
                        .lowStockThreshold(20)
                        .imageUrl("https://i.postimg.cc/g0jhXVFF/image.png")
                        .active(true)
                        .build(),

                Product.builder()
                        .name("FLOWER POT DELUXE")
                        .category(flowerPot)
                        .mrp(new BigDecimal("2500"))
                        .retailDiscountPercent(new BigDecimal("70"))
                        .wholesaleDiscountPercent(new BigDecimal("78"))
                        .boxesPerCase(10)
                        .stockBoxes(40)
                        .minWholesaleCases(2)
                        .maxRetailBoxes(3)
                        .allowPartialCase(true)
                        .lowStockThreshold(10)
                        .imageUrl("https://i.postimg.cc/FHjNC9Cz/image.png")
                        .active(true)
                        .build(),

                Product.builder()
                        .name("BABY ROCKET")
                        .category(rocket)
                        .mrp(new BigDecimal("300"))
                        .retailDiscountPercent(new BigDecimal("65"))
                        .wholesaleDiscountPercent(new BigDecimal("75"))
                        .boxesPerCase(25)
                        .stockBoxes(0) // out of stock example
                        .minWholesaleCases(4)
                        .maxRetailBoxes(6)
                        .allowPartialCase(false)
                        .lowStockThreshold(15)
                        .imageUrl("https://i.postimg.cc/cCK9JBvH/image.png")
                        .active(true)
                        .build()

        ));

        System.out.println("Sample Products Seeded Successfully");
    }
}