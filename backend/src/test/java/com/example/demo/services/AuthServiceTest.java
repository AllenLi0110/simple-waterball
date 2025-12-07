package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.responses.AuthResponse;
import com.example.demo.responses.UserResponse;
import com.example.demo.utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("測試用戶");
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void shouldRegisterNewUser() {
        // Given
        String name = "測試用戶";
        String username = "newuser";
        String password = "password123";
        
        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            user.setCreatedAt(LocalDateTime.now());
            return user;
        });
        when(jwtUtil.generateToken(anyLong())).thenReturn("test-token");

        // When
        AuthResponse response = authService.register(name, username, password);

        // Then
        assertNotNull(response);
        assertNotNull(response.getUser());
        assertEquals(name, response.getUser().getName());
        assertEquals(username, response.getUser().getUsername());
        verify(userRepository, times(1)).existsByUsername(username);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenUsernameAlreadyExists() {
        // Given
        String name = "測試用戶";
        String username = "existinguser";
        String password = "password123";
        
        when(userRepository.existsByUsername(username)).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.register(name, username, password);
        });

        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, times(1)).existsByUsername(username);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldLoginWithValidCredentials() {
        // Given
        String username = "testuser";
        String password = "password123";
        
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken(anyLong())).thenReturn("test-token");

        // When
        AuthResponse response = authService.login(username, password);

        // Then
        assertNotNull(response);
        assertNotNull(response.getUser());
        assertEquals("testuser", response.getUser().getUsername());
        assertEquals("測試用戶", response.getUser().getName());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void shouldThrowExceptionWhenUsernameNotFound() {
        // Given
        String username = "nonexistent";
        String password = "password123";
        
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(username, password);
        });

        assertEquals("Invalid username or password", exception.getMessage());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsIncorrect() {
        // Given
        String username = "testuser";
        String wrongPassword = "wrongpassword";
        
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(username, wrongPassword);
        });

        assertEquals("Invalid username or password", exception.getMessage());
        verify(userRepository, times(1)).findByUsername(username);
    }
}
