package com.abs.backend.controller;

import com.abs.backend.dto.CartResponse;
import com.abs.backend.entity.User;
import com.abs.backend.service.CartService;
import com.abs.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    public CartResponse getCart(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User user = userService.getByPhone(principal.getUsername());
        return cartService.getCartResponse(user);
    }

    @PostMapping("/add")
    public CartResponse addToCart(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        User user = userService.getByPhone(principal.getUsername());
        return cartService.addToCart(user, productId, quantity);
    }

    @PutMapping("/update")
    public CartResponse updateQuantity(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        User user = userService.getByPhone(principal.getUsername());
        return cartService.updateQuantity(user, productId, quantity);
    }

    @DeleteMapping("/remove")
    public CartResponse removeItem(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
            @RequestParam Long productId) {

        User user = userService.getByPhone(principal.getUsername());
        return cartService.removeItem(user, productId);
    }

    @DeleteMapping("/clear")
    public void clearCart(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {

        User user = userService.getByPhone(principal.getUsername());
        cartService.clearCart(user);
    }
}