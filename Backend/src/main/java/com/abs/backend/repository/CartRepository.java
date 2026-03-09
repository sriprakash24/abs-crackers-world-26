package com.abs.backend.repository;

import com.abs.backend.entity.Cart;
import com.abs.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserAndActiveTrue(User user);
}