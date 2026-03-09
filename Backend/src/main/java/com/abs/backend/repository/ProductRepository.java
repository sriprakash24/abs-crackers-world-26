package com.abs.backend.repository;

import com.abs.backend.entity.Category;
import com.abs.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    List<Product> findByCategory(Category category);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategory_NameAndActiveTrue(String categoryName, Pageable pageable);
}