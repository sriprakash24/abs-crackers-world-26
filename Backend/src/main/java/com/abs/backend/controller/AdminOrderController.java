package com.abs.backend.controller;

import com.abs.backend.entity.Order;
import com.abs.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping("/{orderId}/verify")
    public String verifyPayment(@PathVariable Long orderId) {

        orderService.verifyPayment(orderId);

        return "Payment verified. Stock deducted.";
    }

    @PostMapping("/{orderId}/reject")
    public String rejectPayment(@PathVariable Long orderId) {

        orderService.rejectPayment(orderId);

        return "Payment rejected.";
    }

    @PostMapping("/{orderId}/pack")
    public String packItem(
            @PathVariable Long orderId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        orderService.packItem(orderId, productId, quantity);

        return "Packing updated successfully";
    }

    @PostMapping("/{orderId}/ship")
    public String shipOrder(
            @PathVariable Long orderId,
            @RequestParam("file") MultipartFile file,
            @RequestParam String trackingId,
            @RequestParam String transportName) {

        orderService.shipOrder(orderId, file, trackingId, transportName);

        return "Order marked as shipped";
    }
}