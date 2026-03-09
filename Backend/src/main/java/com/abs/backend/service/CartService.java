package com.abs.backend.service;

import com.abs.backend.dto.CartItemResponse;

import com.abs.backend.dto.CartResponse;

import com.abs.backend.entity.*;

import com.abs.backend.exception.CartItemNotFoundException;

import com.abs.backend.exception.InsufficientStockException;

import com.abs.backend.exception.ResourceNotFoundException;

import com.abs.backend.exception.ValidationException;

import com.abs.backend.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import java.time.LocalDateTime;

import java.util.List;

import java.util.Optional;

@Service

@RequiredArgsConstructor

public class CartService {

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    /* ---------------------------------------------------------

       GET OR CREATE ACTIVE CART

    --------------------------------------------------------- */

    public Cart getOrCreateCart(User user) {

        return cartRepository.findByUserAndActiveTrue(user)

                .orElseGet(() -> {

                    Cart cart = Cart.builder()

                            .user(user)

                            .active(true)

                            .createdAt(LocalDateTime.now())

                            .updatedAt(LocalDateTime.now())

                            .build();

                    return cartRepository.save(cart);

                });

    }

    /* ---------------------------------------------------------

       GET CART (DTO)

    --------------------------------------------------------- */

    public CartResponse getCartResponse(User user) {

        Cart cart = getOrCreateCart(user);

        return mapToResponse(cart);

    }

    /* ---------------------------------------------------------

       ADD TO CART

    --------------------------------------------------------- */

    public CartResponse addToCart(User user, Long productId, Integer quantity) {

        if (quantity <= 0) {

            throw new ValidationException("Quantity must be greater than zero");

        }

        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)

                .orElseThrow(() -> new ResourceNotFoundException("Product"));

        if (product.getStockBoxes() < quantity) {

            throw new InsufficientStockException(product.getName());

        }

        Optional<CartItem> existingItem =

                cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItem.isPresent()) {

            CartItem item = existingItem.get();

            item.setQuantity(item.getQuantity() + quantity);

            cartItemRepository.save(item);

        } else {

            CartItem newItem = CartItem.builder()

                    .cart(cart)

                    .product(product)

                    .quantity(quantity)

                    .build();

            cartItemRepository.save(newItem);

        }

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

        return mapToResponse(cart);

    }

    /* ---------------------------------------------------------

       UPDATE CART ITEM QUANTITY

    --------------------------------------------------------- */

    public CartResponse updateQuantity(User user, Long productId, Integer quantity) {

        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)

                .orElseThrow(() -> new ResourceNotFoundException("Product"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)

                .orElseThrow(CartItemNotFoundException::new);

        if (quantity <= 0) {

            cartItemRepository.delete(item);

        } else {

            if (product.getStockBoxes() < quantity) {

                throw new InsufficientStockException(product.getName());

            }

            item.setQuantity(quantity);

            cartItemRepository.save(item);

        }

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

        return mapToResponse(cart);

    }

    /* ---------------------------------------------------------

       REMOVE ITEM

    --------------------------------------------------------- */

    public CartResponse removeItem(User user, Long productId) {

        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)

                .orElseThrow(() -> new ResourceNotFoundException("Product"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)

                .orElseThrow(CartItemNotFoundException::new);

        cartItemRepository.delete(item);

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

        return mapToResponse(cart);

    }

    /* ---------------------------------------------------------

       CLEAR CART

    --------------------------------------------------------- */

    public void clearCart(User user) {

        Cart cart = getOrCreateCart(user);

        List<CartItem> items = cartItemRepository.findByCart(cart);

        cartItemRepository.deleteAll(items);

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

    }

    /* ---------------------------------------------------------

       MAPPER

    --------------------------------------------------------- */

    private CartResponse mapToResponse(Cart cart) {

        // 🔥 FIX: Always load items from repository

        List<CartItem> items = cartItemRepository.findByCart(cart);

        List<CartItemResponse> itemResponses = items.stream()

                .map(item -> {

                    Product product = item.getProduct();

                    BigDecimal mrp = product.getMrp();

                    BigDecimal discountPercent = product.getRetailDiscountPercent();

                    BigDecimal discountAmount = mrp

                            .multiply(discountPercent)

                            .divide(BigDecimal.valueOf(100));

                    BigDecimal sellingPrice = mrp.subtract(discountAmount);

                    BigDecimal totalPrice =

                            sellingPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

                    return CartItemResponse.builder()

                            .productId(product.getId())

                            .productName(product.getName())

                            .imageUrl(product.getImageUrl())

                            .mrp(mrp.doubleValue())

                            .sellingPrice(sellingPrice.doubleValue())

                            .quantity(item.getQuantity())

                            .totalPrice(totalPrice.doubleValue())

                            .build();

                })

                .toList();

        double total = itemResponses.stream()

                .mapToDouble(CartItemResponse::getTotalPrice)

                .sum();

        return CartResponse.builder()

                .cartId(cart.getId())

                .items(itemResponses)

                .totalAmount(total)

                .build();

    }

}