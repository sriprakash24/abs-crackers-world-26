package com.abs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private BigDecimal mrp;

    private BigDecimal retailDiscountPercent;
    private BigDecimal wholesaleDiscountPercent;

    private Integer boxesPerCase;
    private Integer stockBoxes;

    private Integer minWholesaleCases;
    private Integer maxRetailBoxes;

    private Boolean allowPartialCase;

    private Integer lowStockThreshold = 0;

    private String imageUrl;

    private Boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}