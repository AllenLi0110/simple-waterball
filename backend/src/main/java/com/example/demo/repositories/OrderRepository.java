package com.example.demo.repositories;

import com.example.demo.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Order entity
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Find order by order number
     */
    Optional<Order> findByOrderNumber(String orderNumber);
    
    /**
     * Find all orders by user ID
     */
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find all orders by course ID
     */
    List<Order> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    
    /**
     * Find all orders by user ID and course ID
     */
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.course.id = :courseId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdAndCourseIdOrderByCreatedAtDesc(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    /**
     * Find all pending orders that have passed their payment deadline
     */
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' AND o.paymentDeadline < CURRENT_TIMESTAMP")
    List<Order> findExpiredPendingOrders();
}

