package com.example.demo.validators;

import com.example.demo.definitions.ApiConstants;
import com.example.demo.requests.CreateCourseRequest;
import com.example.demo.requests.UpdateCourseRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for CourseValidator
 */
class CourseValidatorTest {

    private CourseValidator courseValidator;

    @BeforeEach
    void setUp() {
        courseValidator = new CourseValidator();
    }

    @Test
    void shouldValidateCreateRequestSuccessfully() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        request.setTitle("Valid Title");
        request.setSubtitle("Valid Subtitle");
        request.setDescription("Valid Description");

        // When & Then - should not throw exception
        assertDoesNotThrow(() -> courseValidator.validateCreateRequest(request));
    }

    @Test
    void shouldThrowExceptionWhenCreateRequestIsNull() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateCreateRequest(null)
        );
        assertEquals("Request cannot be null", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenTitleIsNull() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        request.setTitle(null);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateCreateRequest(request)
        );
        assertEquals("Course title cannot be empty", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenTitleIsEmpty() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        request.setTitle("   ");

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateCreateRequest(request)
        );
        assertEquals("Course title cannot be empty", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenTitleExceedsMaxLength() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        String longTitle = "a".repeat(ApiConstants.MAX_TITLE_LENGTH + 1);
        request.setTitle(longTitle);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateCreateRequest(request)
        );
        assertTrue(exception.getMessage().contains("Course title length cannot exceed"));
    }

    @Test
    void shouldThrowExceptionWhenSubtitleExceedsMaxLength() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        request.setTitle("Valid Title");
        String longSubtitle = "a".repeat(ApiConstants.MAX_SUBTITLE_LENGTH + 1);
        request.setSubtitle(longSubtitle);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateCreateRequest(request)
        );
        assertTrue(exception.getMessage().contains("Subtitle length cannot exceed"));
    }

    @Test
    void shouldThrowExceptionWhenDescriptionExceedsMaxLength() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        request.setTitle("Valid Title");
        String longDescription = "a".repeat(ApiConstants.MAX_DESCRIPTION_LENGTH + 1);
        request.setDescription(longDescription);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateCreateRequest(request)
        );
        assertTrue(exception.getMessage().contains("Description length cannot exceed"));
    }

    @Test
    void shouldValidateUpdateRequestSuccessfully() {
        // Given
        UpdateCourseRequest request = new UpdateCourseRequest();
        request.setTitle("Valid Title");

        // When & Then - should not throw exception
        assertDoesNotThrow(() -> courseValidator.validateUpdateRequest(request));
    }

    @Test
    void shouldThrowExceptionWhenUpdateRequestIsNull() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateUpdateRequest(null)
        );
        assertEquals("Request cannot be null", exception.getMessage());
    }

    @Test
    void shouldAllowNullTitleInUpdateRequest() {
        // Given
        UpdateCourseRequest request = new UpdateCourseRequest();
        request.setTitle(null);

        // When & Then - should not throw exception
        assertDoesNotThrow(() -> courseValidator.validateUpdateRequest(request));
    }

    @Test
    void shouldThrowExceptionWhenUpdateTitleExceedsMaxLength() {
        // Given
        UpdateCourseRequest request = new UpdateCourseRequest();
        String longTitle = "a".repeat(ApiConstants.MAX_TITLE_LENGTH + 1);
        request.setTitle(longTitle);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateUpdateRequest(request)
        );
        assertTrue(exception.getMessage().contains("Course title length cannot exceed"));
    }

    @Test
    void shouldThrowExceptionWhenUpdateSubtitleExceedsMaxLength() {
        // Given
        UpdateCourseRequest request = new UpdateCourseRequest();
        String longSubtitle = "a".repeat(ApiConstants.MAX_SUBTITLE_LENGTH + 1);
        request.setSubtitle(longSubtitle);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateUpdateRequest(request)
        );
        assertTrue(exception.getMessage().contains("Subtitle length cannot exceed"));
    }

    @Test
    void shouldThrowExceptionWhenUpdateDescriptionExceedsMaxLength() {
        // Given
        UpdateCourseRequest request = new UpdateCourseRequest();
        String longDescription = "a".repeat(ApiConstants.MAX_DESCRIPTION_LENGTH + 1);
        request.setDescription(longDescription);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> courseValidator.validateUpdateRequest(request)
        );
        assertTrue(exception.getMessage().contains("Description length cannot exceed"));
    }
}
