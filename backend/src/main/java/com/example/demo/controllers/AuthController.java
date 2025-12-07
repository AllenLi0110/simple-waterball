package com.example.demo.controllers;

import com.example.demo.requests.LoginRequest;
import com.example.demo.requests.RegisterRequest;
import com.example.demo.responses.ApiResponse;
import com.example.demo.responses.AuthResponse;
import com.example.demo.responses.UserResponse;
import com.example.demo.services.AuthService;
import com.example.demo.services.UserService;
import com.example.demo.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Authentication, handles auth-related HTTP requests
 */
@RestController
@RequestMapping("/api/auth")
// CORS is handled globally by WebConfig
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Register a new user
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @RequestBody RegisterRequest request,
            HttpServletResponse httpResponse) {
        try {
            AuthResponse response = authService.register(
                request.getName(),
                request.getUsername(),
                request.getPassword()
            );
            
            // Set JWT token in cookie
            if (response.getToken() != null) {
                Cookie cookie = new Cookie("token", response.getToken());
                cookie.setHttpOnly(true);
                cookie.setSecure(false); // Set to true in production with HTTPS
                cookie.setPath("/");
                cookie.setMaxAge(30 * 24 * 60 * 60); // 30 days in seconds
                httpResponse.addCookie(cookie);
            }
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }
    
    /**
     * Login user
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody LoginRequest request,
            HttpServletResponse httpResponse) {
        try {
            AuthResponse response = authService.login(
                request.getUsername(),
                request.getPassword()
            );
            
            // Set JWT token in cookie
            if (response.getToken() != null) {
                Cookie cookie = new Cookie("token", response.getToken());
                cookie.setHttpOnly(true);
                cookie.setSecure(false); // Set to true in production with HTTPS
                cookie.setPath("/");
                cookie.setMaxAge(30 * 24 * 60 * 60); // 30 days in seconds
                httpResponse.addCookie(cookie);
            }
            
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }
    
    /**
     * Logout user
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse httpResponse) {
        // Clear the token cookie
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Delete cookie
        httpResponse.addCookie(cookie);
        
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }
    
    /**
     * Verify token and get current user
     * GET /api/auth/verify
     * Returns 200 even when not authenticated (to avoid browser console errors)
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<UserResponse>> verify(
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            // Get token from cookie
            Cookie[] cookies = request.getCookies();
            String token = null;
            
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
            
            // If no token in cookie, try Authorization header as fallback
            if (token == null) {
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
            }
            
            // If no token or invalid token, return 200 with success=false (not 401)
            if (token == null || !jwtUtil.validateToken(token)) {
                return ResponseEntity.ok(ApiResponse.error("Not authenticated"));
            }
            
            // Token is valid, get user ID and return user data
            Long userId = jwtUtil.getUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.ok(ApiResponse.error("Invalid token"));
            }
            
            UserResponse user = userService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.success("Token is valid", user));
        } catch (IllegalArgumentException e) {
            // User not found - return 200 with error message (not 401)
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Failed to verify token: " + e.getMessage()));
        }
    }
}
