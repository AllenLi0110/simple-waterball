package com.example.demo.helpers;

import com.example.demo.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Response helper class
 */
public class ResponseHelper {
    
    /**
     * Create success response
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }
    
    /**
     * Create success response with message
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        return ResponseEntity.ok(ApiResponse.success(message, data));
    }
    
    /**
     * Create success response with status code
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(HttpStatus status, String message, T data) {
        return ResponseEntity.status(status).body(ApiResponse.success(message, data));
    }
    
    /**
     * Create error response
     */
    public static <T> ResponseEntity<ApiResponse<T>> error(String message) {
        return ResponseEntity.ok(ApiResponse.error(message));
    }
    
    /**
     * Create error response with status code
     */
    public static <T> ResponseEntity<ApiResponse<T>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiResponse.error(message));
    }
    
    private ResponseHelper() {
        // Prevent instantiation
    }
}
