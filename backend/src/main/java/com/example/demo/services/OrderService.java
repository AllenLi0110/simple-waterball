package com.example.demo.services;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Course;
import com.example.demo.models.Order;
import com.example.demo.models.User;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * Service layer for Order, handles business logic
 */
@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    private static final Random random = new Random();
    
    /**
     * Generate order number: yyyyMMddHHmmss + 4 random digits (18 digits total)
     */
    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        String timestamp = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        
        // Generate 4 random alphanumeric characters
        String randomPart = "";
        String chars = "0123456789abcdefghijklmnopqrstuvwxyz";
        for (int i = 0; i < 4; i++) {
            randomPart += chars.charAt(random.nextInt(chars.length()));
        }
        
        return timestamp + randomPart;
    }
    
    /**
     * Create a new order
     */
    public Order createOrder(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        
        String orderNumber = generateOrderNumber();
        LocalDateTime paymentDeadline = LocalDateTime.now().plusDays(3); // 3 days from now
        
        Order order = new Order(orderNumber, user, course, paymentDeadline);
        return orderRepository.save(order);
    }
    
    /**
     * Get order by order number
     */
    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }
    
    /**
     * Get order by ID
     */
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    /**
     * Get all orders by user ID
     */
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get all orders by course ID
     */
    public List<Order> getOrdersByCourseId(Long courseId) {
        return orderRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }
    
    /**
     * Get all orders by user ID and course ID
     */
    public List<Order> getOrdersByUserIdAndCourseId(Long userId, Long courseId) {
        return orderRepository.findByUserIdAndCourseIdOrderByCreatedAtDesc(userId, courseId);
    }
    
    /**
     * Complete payment for an order
     */
    public Order completePayment(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));
        
        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException("Order is not in PENDING status");
        }
        
        if (LocalDateTime.now().isAfter(order.getPaymentDeadline())) {
            throw new IllegalStateException("Payment deadline has passed");
        }
        
        order.setStatus("PAID");
        order.setPaymentDate(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    /**
     * Cancel expired orders (scheduled task)
     * This method runs periodically to cancel orders that have passed their payment deadline
     */
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cancelExpiredOrders() {
        List<Order> expiredOrders = orderRepository.findExpiredPendingOrders();
        for (Order order : expiredOrders) {
            order.setStatus("CANCELLED");
            order.setRemarks("期限內未完成付款");
            orderRepository.save(order);
        }
        if (!expiredOrders.isEmpty()) {
            System.out.println("Cancelled " + expiredOrders.size() + " expired orders");
        }
    }
    
    /**
     * Manually cancel an expired order (for immediate processing)
     */
    public void cancelExpiredOrder(Order order) {
        if ("PENDING".equals(order.getStatus()) && LocalDateTime.now().isAfter(order.getPaymentDeadline())) {
            order.setStatus("CANCELLED");
            order.setRemarks("期限內未完成付款");
            orderRepository.save(order);
        }
    }
}

