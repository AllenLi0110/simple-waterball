package com.example.demo.controllers;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Course;
import com.example.demo.requests.CreateCourseRequest;
import com.example.demo.requests.UpdateCourseRequest;
import com.example.demo.responses.ApiResponse;
import com.example.demo.responses.CourseResponse;
import com.example.demo.services.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for CourseController
 */
@ExtendWith(MockitoExtension.class)
class CourseControllerTest {

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController courseController;

    private Course testCourse;
    private CourseResponse testCourseResponse;

    @BeforeEach
    void setUp() {
        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setTitle("Test Course");
        testCourse.setSubtitle("Test Subtitle");
        testCourse.setDescription("Test Description");
        testCourse.setPriceText("NT$ 1,000");
        testCourse.setButtonLabel("Buy Now");
        testCourse.setImageUrl("/images/test.png");
        testCourse.setImageSubtitle("Test Image");
        testCourse.setIsFeatured(true);

        testCourseResponse = new CourseResponse(
                1L,
                "Test Course",
                "Test Subtitle",
                "Test Description",
                "NT$ 1,000",
                "Buy Now",
                "/images/test.png",
                "Test Image",
                true,
                null
        );
    }

    @Test
    void shouldGetAllCourses() {
        // Given
        List<Course> courses = Arrays.asList(testCourse);
        when(courseService.getAllCourses()).thenReturn(courses);

        // When
        ResponseEntity<ApiResponse<List<CourseResponse>>> response = courseController.getAllCourses();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData());
        assertEquals(1, response.getBody().getData().size());
        verify(courseService, times(1)).getAllCourses();
    }

    @Test
    void shouldGetFeaturedCourses() {
        // Given
        List<Course> featuredCourses = Arrays.asList(testCourse);
        when(courseService.getFeaturedCourses()).thenReturn(featuredCourses);

        // When
        ResponseEntity<ApiResponse<List<CourseResponse>>> response = courseController.getFeaturedCourses();

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData());
        verify(courseService, times(1)).getFeaturedCourses();
    }

    @Test
    void shouldGetCourseById() {
        // Given
        Long courseId = 1L;
        when(courseService.getCourseById(courseId)).thenReturn(Optional.of(testCourse));

        // When
        ResponseEntity<ApiResponse<CourseResponse>> response = courseController.getCourseById(courseId);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData());
        verify(courseService, times(1)).getCourseById(courseId);
    }

    @Test
    void shouldReturnNotFoundWhenCourseNotFound() {
        // Given
        Long courseId = 999L;
        when(courseService.getCourseById(courseId)).thenReturn(Optional.empty());

        // When
        ResponseEntity<ApiResponse<CourseResponse>> response = courseController.getCourseById(courseId);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        verify(courseService, times(1)).getCourseById(courseId);
    }

    @Test
    void shouldCreateCourse() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        request.setTitle("New Course");
        request.setSubtitle("New Subtitle");
        request.setDescription("New Description");
        request.setPriceText("NT$ 2,000");
        request.setButtonLabel("Buy");
        request.setImageUrl("/images/new.png");
        request.setImageSubtitle("New Image");
        request.setIsFeatured(false);

        when(courseService.createCourse(any(Course.class))).thenReturn(testCourse);

        // When
        ResponseEntity<ApiResponse<CourseResponse>> response = courseController.createCourse(request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        verify(courseService, times(1)).createCourse(any(Course.class));
    }

    @Test
    void shouldUpdateCourse() {
        // Given
        Long courseId = 1L;
        UpdateCourseRequest request = new UpdateCourseRequest();
        request.setTitle("Updated Course");
        request.setSubtitle("Updated Subtitle");
        request.setDescription("Updated Description");
        request.setPriceText("NT$ 3,000");
        request.setButtonLabel("Update");
        request.setImageUrl("/images/updated.png");
        request.setImageSubtitle("Updated Image");
        request.setIsFeatured(true);

        when(courseService.updateCourse(eq(courseId), any(Course.class))).thenReturn(testCourse);

        // When
        ResponseEntity<ApiResponse<CourseResponse>> response = courseController.updateCourse(courseId, request);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        verify(courseService, times(1)).updateCourse(eq(courseId), any(Course.class));
    }

    @Test
    void shouldDeleteCourse() {
        // Given
        Long courseId = 1L;
        doNothing().when(courseService).deleteCourse(courseId);

        // When
        ResponseEntity<ApiResponse<Void>> response = courseController.deleteCourse(courseId);

        // Then
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        verify(courseService, times(1)).deleteCourse(courseId);
    }
}
