package com.abs.backend.controller;

import com.abs.backend.dto.CheckoutRequest;
import com.abs.backend.dto.OrderResponse;
import com.abs.backend.entity.Order;
import com.abs.backend.entity.User;
import com.abs.backend.service.OrderService;
import com.abs.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping("/checkout")
    public OrderResponse checkout(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody CheckoutRequest request) {

        User user = userService.getByPhone(principal.getUsername());

        return orderService.createOrderFromCart(user, request.getAddressId());
    }

    @GetMapping("/my-orders")
    public List<OrderResponse> getMyOrders(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {

        User user = userService.getByPhone(principal.getUsername());
        return orderService.getMyOrders(user);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrderById(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
            @PathVariable Long orderId) {

        User user = userService.getByPhone(principal.getUsername());
        return orderService.getOrderById(user, orderId);
    }
    @PostMapping("/{orderId}/submit-payment")
    public String submitPayment(
            @PathVariable Long orderId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("reference") String reference,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) throws Exception {

        User user = userService.getByPhone(principal.getUsername());

        orderService.submitPayment(orderId, user, file, reference);

        return "Payment submitted successfully. Awaiting admin verification.";
    }
}