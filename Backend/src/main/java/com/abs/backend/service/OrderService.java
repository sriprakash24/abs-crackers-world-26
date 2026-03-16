package com.abs.backend.service;

import com.abs.backend.dto.OrderItemResponse;
import com.abs.backend.dto.OrderResponse;
import com.abs.backend.entity.*;
import com.abs.backend.exception.*;
import com.abs.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final FileStorageService fileStorageService;
    private final AddressRepository addressRepository;

    public OrderResponse createOrderFromCart(User user, Long addressId) {

        Cart cart = cartRepository.findByUserAndActiveTrue(user)
                .orElseThrow(() -> new ValidationException("Cart is empty"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new ValidationException("Cart is empty");
        }

        // 🔥 Determine order type based on user role
        OrderType orderType =
                user.getRole() == Role.ROLE_WHOLESALE
                        ? OrderType.WHOLESALE
                        : OrderType.RETAIL;

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .orderType(orderType)   // ✅ ADD THIS

                // ✅ ADDRESS SNAPSHOT
                .addressId(address.getId())
                .deliveryName(address.getFullName())
                .deliveryPhone(address.getPhone())
                .deliveryAddress(address.getAddressLine())
                .deliveryCity(address.getCity())
                .deliveryState(address.getState())
                .deliveryPincode(address.getPincode())

                .orderStatus(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.PENDING)
                .editable(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

//        Order order = Order.builder()
//                .orderNumber(generateOrderNumber())
//                .user(user)
//                .orderStatus(OrderStatus.PLACED)
//                .paymentStatus(PaymentStatus.PENDING)
//                .editable(true)
//                .createdAt(LocalDateTime.now())
//                .updatedAt(LocalDateTime.now())
//                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            if (product.getStockBoxes() < cartItem.getQuantity()) {
                throw new InsufficientStockException(product.getName());
            }

            BigDecimal mrp = product.getMrp();
            BigDecimal discountPercent = product.getRetailDiscountPercent() == null
                    ? BigDecimal.ZERO
                    : product.getRetailDiscountPercent();

            BigDecimal sellingPrice = mrp.subtract(
                    mrp.multiply(discountPercent)
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
            );

            BigDecimal totalPrice = sellingPrice.multiply(
                    BigDecimal.valueOf(cartItem.getQuantity())
            );

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .packedQuantity(0)
                    .mrp(mrp)
                    .sellingPrice(sellingPrice)
                    .totalPrice(totalPrice)
                    .build();

            order.getItems().add(orderItem);

            totalAmount = totalAmount.add(totalPrice);

            // Deduct stock
//            product.setStockBoxes(product.getStockBoxes() - cartItem.getQuantity());
//            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Deactivate cart
        cart.setActive(false);
        cartRepository.save(cart);

        return mapToResponse(savedOrder);
    }

    private OrderResponse mapToResponse(Order order) {

        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .imageUrl(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .price(item.getSellingPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .totalAmount(order.getTotalAmount())
                .editable(order.isEditable())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    private String generateOrderNumber() {
        return "ABS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public List<OrderResponse> getMyOrders(User user) {

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);

        return orders.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse getOrderById(User user, Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Security check
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not allowed to view this order");
        }

        return mapToResponse(order);
    }

    public void submitPayment(Long orderId, User user, MultipartFile file, String reference) throws Exception {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ValidationException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You cannot submit payment for this order");
        }

        if (order.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new ValidationException("Payment already submitted");
        }

        String filePath = fileStorageService.storeFile(file);

        order.setPaymentScreenshotPath(filePath);
        order.setPaymentReference(reference);
        order.setPaymentSubmittedAt(LocalDateTime.now());
        order.setPaymentStatus(PaymentStatus.SUBMITTED);
        order.setEditable(false);

        orderRepository.save(order);
    }

    public void verifyPayment(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getPaymentStatus() != PaymentStatus.SUBMITTED) {
            throw new ValidationException("Payment not submitted yet");
        }

        // 🔥 Deduct stock here
        for (OrderItem item : order.getItems()) {

            Product product = item.getProduct();

            if (product.getStockBoxes() < item.getQuantity()) {
                throw new InsufficientStockException(product.getName());
            }

            product.setStockBoxes(
                    product.getStockBoxes() - item.getQuantity()
            );

            productRepository.save(product);
        }

        order.setPaymentStatus(PaymentStatus.VERIFIED);
        order.setOrderStatus(OrderStatus.PROCESSING);
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }

    public void rejectPayment(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getPaymentStatus() != PaymentStatus.SUBMITTED) {
            throw new ValidationException("Payment not submitted yet");
        }

        order.setPaymentStatus(PaymentStatus.REJECTED);
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }

    public void packItem(Long orderId, Long productId, Integer packQuantity) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getOrderStatus() != OrderStatus.PROCESSING &&
                order.getOrderStatus() != OrderStatus.PACKING &&
                order.getOrderStatus() != OrderStatus.PARTIALLY_PACKED) {

            throw new ValidationException("Order cannot be packed in current state");
        }

        OrderItem item = order.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ValidationException("Product not part of order"));

        Integer currentPacked = item.getPackedQuantity() == null ? 0 : item.getPackedQuantity();

        if (currentPacked + packQuantity > item.getQuantity()) {
            throw new ValidationException("Packing exceeds ordered quantity");
        }

        item.setPackedQuantity(currentPacked + packQuantity);

        updateOrderPackingStatus(order);

        orderRepository.save(order);
    }

    private void updateOrderPackingStatus(Order order) {

        boolean allPacked = true;
        boolean anyPacked = false;

        for (OrderItem item : order.getItems()) {

            Integer packed = item.getPackedQuantity() == null ? 0 : item.getPackedQuantity();

            if (packed > 0) {
                anyPacked = true;
            }

            if (!packed.equals(item.getQuantity())) {
                allPacked = false;
            }
        }

        if (allPacked) {
            order.setOrderStatus(OrderStatus.READY_TO_SHIP);
        } else if (anyPacked) {
            order.setOrderStatus(OrderStatus.PARTIALLY_PACKED);
        } else {
            order.setOrderStatus(OrderStatus.PACKING);
        }

        order.setUpdatedAt(LocalDateTime.now());
    }

    public Order getOrderById(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Force load items to avoid lazy loading issues
        order.getItems().size();

        return order;
    }

    public void shipOrder(Long orderId,
                          MultipartFile file,
                          String trackingId,
                          String transportName) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getOrderStatus() != OrderStatus.READY_TO_SHIP) {
            throw new ValidationException("Order not ready for shipping");
        }

        String slipPath = fileStorageService.storeFile(file);

        order.setTrackingId(trackingId);
        order.setTransportName(transportName);
        order.setShippingSlipPath(slipPath);
        order.setShippedAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.SHIPPED);
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }

    public void markDelivered(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getOrderStatus() != OrderStatus.SHIPPED) {
            throw new ValidationException("Order not shipped yet");
        }

        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setDeliveredAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}