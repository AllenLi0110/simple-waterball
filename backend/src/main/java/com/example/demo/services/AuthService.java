package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.responses.AuthResponse;
import com.example.demo.responses.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service layer for Authentication, handles business logic
 */
@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Register a new user
     * @param name user's name
     * @param username username (must be unique)
     * @param password password (stored as plain text for simplicity)
     * @return AuthResponse with user information
     * @throws IllegalArgumentException if username already exists
     */
    public AuthResponse register(String name, String username, String password) {
        // Check if username already exists
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Create new user
        User user = new User(name, username, password);
        user = userRepository.save(user);
        
        // Convert to response
        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getName(),
            user.getUsername(),
            user.getCreatedAt()
        );
        
        return new AuthResponse(userResponse, null);
    }
    
    /**
     * Login user
     * @param username username
     * @param password password
     * @return AuthResponse with user information if login successful
     * @throws IllegalArgumentException if username or password is incorrect
     */
    public AuthResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));
        
        // Simple password comparison (for simplicity, no encryption)
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        
        // Convert to response
        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getName(),
            user.getUsername(),
            user.getCreatedAt()
        );
        
        return new AuthResponse(userResponse, null);
    }
}
