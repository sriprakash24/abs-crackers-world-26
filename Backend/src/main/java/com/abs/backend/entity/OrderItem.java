package com.abs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne
//    private Order order;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne
    private Product product;

    private Integer quantity;

    private BigDecimal mrp;

    private BigDecimal sellingPrice;

    private BigDecimal totalPrice;

    private Integer packedQuantity = 0;
}