package com.example.demo.services;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Course;
import com.example.demo.repositories.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for CourseService
 */
@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Course testCourse;

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
    }

    @Test
    void shouldGetAllCourses() {
        // Given
        List<Course> courses = Arrays.asList(testCourse);
        when(courseRepository.findAll()).thenReturn(courses);

        // When
        List<Course> result = courseService.getAllCourses();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Course", result.get(0).getTitle());
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    void shouldGetCourseById() {
        // Given
        Long courseId = 1L;
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        // When
        Optional<Course> result = courseService.getCourseById(courseId);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Test Course", result.get().getTitle());
        verify(courseRepository, times(1)).findById(courseId);
    }

    @Test
    void shouldReturnEmptyWhenCourseNotFound() {
        // Given
        Long courseId = 999L;
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        // When
        Optional<Course> result = courseService.getCourseById(courseId);

        // Then
        assertFalse(result.isPresent());
        verify(courseRepository, times(1)).findById(courseId);
    }

    @Test
    void shouldCreateCourse() {
        // Given
        when(courseRepository.save(any(Course.class))).thenReturn(testCourse);

        // When
        Course result = courseService.createCourse(testCourse);

        // Then
        assertNotNull(result);
        assertEquals("Test Course", result.getTitle());
        verify(courseRepository, times(1)).save(testCourse);
    }

    @Test
    void shouldUpdateCourse() {
        // Given
        Long courseId = 1L;
        Course updatedCourse = new Course();
        updatedCourse.setTitle("Updated Title");
        updatedCourse.setSubtitle("Updated Subtitle");
        updatedCourse.setDescription("Updated Description");
        updatedCourse.setPriceText("NT$ 2,000");
        updatedCourse.setButtonLabel("Updated Button");
        updatedCourse.setImageUrl("/images/updated.png");
        updatedCourse.setImageSubtitle("Updated Image");
        updatedCourse.setIsFeatured(false);

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(courseRepository.save(any(Course.class))).thenReturn(testCourse);

        // When
        Course result = courseService.updateCourse(courseId, updatedCourse);

        // Then
        assertNotNull(result);
        verify(courseRepository, times(1)).findById(courseId);
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistentCourse() {
        // Given
        Long courseId = 999L;
        Course updatedCourse = new Course();
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            courseService.updateCourse(courseId, updatedCourse);
        });
        verify(courseRepository, times(1)).findById(courseId);
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void shouldDeleteCourse() {
        // Given
        Long courseId = 1L;
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        doNothing().when(courseRepository).delete(any(Course.class));

        // When
        courseService.deleteCourse(courseId);

        // Then
        verify(courseRepository, times(1)).findById(courseId);
        verify(courseRepository, times(1)).delete(testCourse);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistentCourse() {
        // Given
        Long courseId = 999L;
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            courseService.deleteCourse(courseId);
        });
        verify(courseRepository, times(1)).findById(courseId);
        verify(courseRepository, never()).delete(any(Course.class));
    }

    @Test
    void shouldGetFeaturedCourses() {
        // Given
        List<Course> featuredCourses = Arrays.asList(testCourse);
        when(courseRepository.findByIsFeaturedTrue()).thenReturn(featuredCourses);

        // When
        List<Course> result = courseService.getFeaturedCourses();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getIsFeatured());
        verify(courseRepository, times(1)).findByIsFeaturedTrue();
    }
}
