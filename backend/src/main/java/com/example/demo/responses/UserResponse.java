package com.example.demo.responses;

import java.time.LocalDateTime;

/**
 * Response DTO for User
 */
public class UserResponse {
    
    private Long id;
    private String name;
    private String username;
    private LocalDateTime createdAt;
    
    public UserResponse() {}
    
    public UserResponse(Long id, String name, String username, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
