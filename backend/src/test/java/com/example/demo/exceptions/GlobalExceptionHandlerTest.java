package com.example.demo.exceptions;

import com.example.demo.responses.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for GlobalExceptionHandler
 */
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void shouldHandleResourceNotFoundException() {
        // Given
        String errorMessage = "Course not found";
        ResourceNotFoundException exception = new ResourceNotFoundException(errorMessage);

        // When
        ResponseEntity<ApiResponse<Object>> response = exceptionHandler.handleResourceNotFoundException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals(errorMessage, response.getBody().getMessage());
    }

    @Test
    void shouldHandleMethodArgumentNotValidException() {
        // Given
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        
        List<org.springframework.validation.ObjectError> errors = new ArrayList<>();
        FieldError fieldError = new FieldError("course", "title", "Title is required");
        errors.add(fieldError);

        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(errors);

        // When
        ResponseEntity<ApiResponse<Map<String, String>>> response = 
            exceptionHandler.handleValidationExceptions(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Validation failed", response.getBody().getMessage());
        assertNotNull(response.getBody().getData());
        assertTrue(response.getBody().getData().containsKey("title"));
        assertEquals("Title is required", response.getBody().getData().get("title"));
    }

    @Test
    void shouldHandleGenericException() {
        // Given
        String errorMessage = "Something went wrong";
        Exception exception = new Exception(errorMessage);

        // When
        ResponseEntity<ApiResponse<Object>> response = exceptionHandler.handleGenericException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("An error occurred"));
        assertTrue(response.getBody().getMessage().contains(errorMessage));
    }

    @Test
    void shouldHandleExceptionWithCause() {
        // Given
        Throwable cause = new RuntimeException("Root cause");
        Exception exception = new Exception("Something went wrong", cause);

        // When
        ResponseEntity<ApiResponse<Object>> response = exceptionHandler.handleGenericException(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("Caused by"));
        assertTrue(response.getBody().getMessage().contains("Root cause"));
    }

    @Test
    void shouldHandleMultipleValidationErrors() {
        // Given
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        
        List<org.springframework.validation.ObjectError> errors = new ArrayList<>();
        errors.add(new FieldError("course", "title", "Title is required"));
        errors.add(new FieldError("course", "subtitle", "Subtitle is too long"));

        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(errors);

        // When
        ResponseEntity<ApiResponse<Map<String, String>>> response = 
            exceptionHandler.handleValidationExceptions(exception);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        Map<String, String> errorMap = response.getBody().getData();
        assertEquals(2, errorMap.size());
        assertTrue(errorMap.containsKey("title"));
        assertTrue(errorMap.containsKey("subtitle"));
    }
}
