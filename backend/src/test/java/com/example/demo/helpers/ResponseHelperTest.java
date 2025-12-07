package com.example.demo.helpers;

import com.example.demo.responses.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ResponseHelper
 */
class ResponseHelperTest {

    @Test
    void shouldCreateSuccessResponse() {
        // Given
        String data = "test data";

        // When
        ResponseEntity<ApiResponse<String>> response = ResponseHelper.success(data);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("test data", response.getBody().getData());
    }

    @Test
    void shouldCreateSuccessResponseWithMessage() {
        // Given
        String message = "Operation successful";
        String data = "test data";

        // When
        ResponseEntity<ApiResponse<String>> response = ResponseHelper.success(message, data);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("test data", response.getBody().getData());
    }

    @Test
    void shouldCreateSuccessResponseWithStatus() {
        // Given
        HttpStatus status = HttpStatus.CREATED;
        String message = "Resource created";
        String data = "test data";

        // When
        ResponseEntity<ApiResponse<String>> response = ResponseHelper.success(status, message, data);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("test data", response.getBody().getData());
    }

    @Test
    void shouldCreateErrorResponse() {
        // Given
        String errorMessage = "An error occurred";

        // When
        ResponseEntity<ApiResponse<Object>> response = ResponseHelper.error(errorMessage);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("An error occurred", response.getBody().getMessage());
    }

    @Test
    void shouldCreateErrorResponseWithStatus() {
        // Given
        HttpStatus status = HttpStatus.NOT_FOUND;
        String errorMessage = "Resource not found";

        // When
        ResponseEntity<ApiResponse<Object>> response = ResponseHelper.error(status, errorMessage);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Resource not found", response.getBody().getMessage());
    }

    @Test
    void shouldHandleNullData() {
        // When
        ResponseEntity<ApiResponse<Object>> response = ResponseHelper.success((Object) null);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNull(response.getBody().getData());
    }

    @Test
    void shouldHandleComplexDataTypes() {
        // Given
        Integer[] data = {1, 2, 3};

        // When
        ResponseEntity<ApiResponse<Integer[]>> response = ResponseHelper.success(data);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertArrayEquals(new Integer[]{1, 2, 3}, response.getBody().getData());
    }
}
