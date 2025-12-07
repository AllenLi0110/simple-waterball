package com.example.demo.requests;

/**
 * Request DTO for creating an order
 */
public class CreateOrderRequest {
    
    private Long userId;
    private Long courseId;
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}

