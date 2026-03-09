package com.abs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String phone;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    private boolean isDefault;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}