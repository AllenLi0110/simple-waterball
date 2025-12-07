package com.example.demo.controllers;

import com.example.demo.models.Order;
import com.example.demo.requests.CreateOrderRequest;
import com.example.demo.responses.ApiResponse;
import com.example.demo.responses.OrderResponse;
import com.example.demo.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for Order, handles order-related HTTP requests
 */
@RestController
@RequestMapping("/api/orders")
// CORS is handled globally by WebConfig
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    /**
     * Create a new order
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Order order = orderService.createOrder(request.getUserId(), request.getCourseId());
            OrderResponse response = toResponse(order);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Order created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get order by order number
     * GET /api/orders/number/{orderNumber}
     */
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByOrderNumber(@PathVariable String orderNumber) {
        return orderService.getOrderByOrderNumber(orderNumber)
                .map(order -> {
                    // Check and cancel if expired
                    orderService.cancelExpiredOrder(order);
                    OrderResponse response = toResponse(order);
                    return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", response));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Order not found")));
    }
    
    /**
     * Get order by ID
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(order -> {
                    // Check and cancel if expired
                    orderService.cancelExpiredOrder(order);
                    OrderResponse response = toResponse(order);
                    return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", response));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Order not found")));
    }
    
    /**
     * Get all orders by user ID
     * GET /api/orders/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        // Check and cancel expired orders
        orders.forEach(order -> orderService.cancelExpiredOrder(order));
        List<OrderResponse> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", responses));
    }
    
    /**
     * Get all orders by course ID
     * GET /api/orders/course/{courseId}
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByCourseId(@PathVariable Long courseId) {
        List<Order> orders = orderService.getOrdersByCourseId(courseId);
        // Check and cancel expired orders
        orders.forEach(order -> orderService.cancelExpiredOrder(order));
        List<OrderResponse> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", responses));
    }
    
    /**
     * Get all orders by user ID and course ID
     * GET /api/orders/user/{userId}/course/{courseId}
     */
    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByUserIdAndCourseId(
            @PathVariable Long userId,
            @PathVariable Long courseId) {
        List<Order> orders = orderService.getOrdersByUserIdAndCourseId(userId, courseId);
        // Check and cancel expired orders
        orders.forEach(order -> orderService.cancelExpiredOrder(order));
        List<OrderResponse> responses = orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", responses));
    }
    
    /**
     * Complete payment for an order
     * POST /api/orders/{orderNumber}/complete-payment
     */
    @PostMapping("/{orderNumber}/complete-payment")
    public ResponseEntity<ApiResponse<OrderResponse>> completePayment(@PathVariable String orderNumber) {
        try {
            Order order = orderService.completePayment(orderNumber);
            OrderResponse response = toResponse(order);
            return ResponseEntity.ok(ApiResponse.success("Payment completed successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Convert Order entity to OrderResponse DTO
     */
    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getCourse().getId(),
                order.getCourse().getTitle(),
                order.getStatus(),
                order.getPaymentDeadline(),
                order.getPaymentDate(),
                order.getRemarks(),
                order.getCreatedAt()
        );
    }
}

