package com.abs.backend.repository;

import com.abs.backend.entity.Order;
import com.abs.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);

    boolean existsByOrderNumber(String orderNumber);

    List<Order> findByUserOrderByCreatedAtDesc(User user);
}