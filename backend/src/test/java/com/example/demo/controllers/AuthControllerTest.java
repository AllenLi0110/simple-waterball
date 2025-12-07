package com.example.demo.controllers;

import com.example.demo.requests.LoginRequest;
import com.example.demo.requests.RegisterRequest;
import com.example.demo.responses.ApiResponse;
import com.example.demo.responses.AuthResponse;
import com.example.demo.responses.UserResponse;
import com.example.demo.services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthController
 */
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private AuthResponse testAuthResponse;
    private UserResponse testUserResponse;

    @BeforeEach
    void setUp() {
        testUserResponse = new UserResponse();
        testUserResponse.setId(1L);
        testUserResponse.setName("測試用戶");
        testUserResponse.setUsername("testuser");
        testUserResponse.setCreatedAt(LocalDateTime.now());

        testAuthResponse = new AuthResponse();
        testAuthResponse.setUser(testUserResponse);
        testAuthResponse.setToken(null);
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setName("測試用戶");
        request.setUsername("newuser");
        request.setPassword("password123");

        when(authService.register(anyString(), anyString(), anyString()))
                .thenReturn(testAuthResponse);

        // When
        ResponseEntity<ApiResponse<AuthResponse>> response = authController.register(request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData());
        assertEquals("測試用戶", response.getBody().getData().getUser().getName());
        verify(authService, times(1)).register(anyString(), anyString(), anyString());
    }

    @Test
    void shouldReturnBadRequestWhenRegistrationFails() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setName("測試用戶");
        request.setUsername("existinguser");
        request.setPassword("password123");

        when(authService.register(anyString(), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Username already exists"));

        // When
        ResponseEntity<ApiResponse<AuthResponse>> response = authController.register(request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Username already exists", response.getBody().getMessage());
        verify(authService, times(1)).register(anyString(), anyString(), anyString());
    }

    @Test
    void shouldLoginUserSuccessfully() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        when(authService.login(anyString(), anyString()))
                .thenReturn(testAuthResponse);

        // When
        ResponseEntity<ApiResponse<AuthResponse>> response = authController.login(request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData());
        assertEquals("testuser", response.getBody().getData().getUser().getUsername());
        verify(authService, times(1)).login(anyString(), anyString());
    }

    @Test
    void shouldReturnUnauthorizedWhenLoginFails() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");

        when(authService.login(anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Invalid username or password"));

        // When
        ResponseEntity<ApiResponse<AuthResponse>> response = authController.login(request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Invalid username or password", response.getBody().getMessage());
        verify(authService, times(1)).login(anyString(), anyString());
    }

    @Test
    void shouldLogoutSuccessfully() {
        // When
        ResponseEntity<ApiResponse<Void>> response = authController.logout();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Logout successful", response.getBody().getMessage());
    }
}
