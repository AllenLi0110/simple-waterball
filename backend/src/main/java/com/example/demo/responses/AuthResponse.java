package com.example.demo.responses;

/**
 * Response DTO for authentication operations
 */
public class AuthResponse {
    
    private UserResponse user;
    private String token; // For future use with JWT
    
    public AuthResponse() {}
    
    public AuthResponse(UserResponse user, String token) {
        this.user = user;
        this.token = token;
    }
    
    // Getters and Setters
    public UserResponse getUser() {
        return user;
    }
    
    public void setUser(UserResponse user) {
        this.user = user;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
}
