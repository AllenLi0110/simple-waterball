package com.example.demo.responses;

import java.time.LocalDateTime;

/**
 * Order response DTO
 */
public class OrderResponse {
    
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userName;
    private Long courseId;
    private String courseTitle;
    private String status;
    private LocalDateTime paymentDeadline;
    private LocalDateTime paymentDate;
    private String remarks;
    private LocalDateTime createdAt;
    
    // Constructor
    public OrderResponse() {}
    
    public OrderResponse(Long id, String orderNumber, Long userId, String userName,
                        Long courseId, String courseTitle, String status,
                        LocalDateTime paymentDeadline, LocalDateTime paymentDate,
                        String remarks, LocalDateTime createdAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.userId = userId;
        this.userName = userName;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.status = status;
        this.paymentDeadline = paymentDeadline;
        this.paymentDate = paymentDate;
        this.remarks = remarks;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseTitle() {
        return courseTitle;
    }
    
    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getPaymentDeadline() {
        return paymentDeadline;
    }
    
    public void setPaymentDeadline(LocalDateTime paymentDeadline) {
        this.paymentDeadline = paymentDeadline;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

