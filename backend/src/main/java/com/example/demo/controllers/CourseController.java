package com.example.demo.controllers;

import com.example.demo.models.Course;
import com.example.demo.requests.CreateCourseRequest;
import com.example.demo.requests.UpdateCourseRequest;
import com.example.demo.responses.ApiResponse;
import com.example.demo.responses.CourseResponse;
import com.example.demo.services.CourseService;
import com.example.demo.utils.CourseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for Course, handles course-related HTTP requests
 */
@RestController
@RequestMapping("/api/courses")
// CORS is handled globally by WebConfig
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    /**
     * Get all courses
     * GET /api/courses
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        List<CourseResponse> responses = courses.stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Successfully retrieved course list", responses));
    }
    
    /**
     * Get featured courses
     * GET /api/courses/featured
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getFeaturedCourses() {
        List<Course> courses = courseService.getFeaturedCourses();
        List<CourseResponse> responses = courses.stream()
                .map(CourseMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Successfully retrieved featured courses", responses));
    }
    
    /**
     * Get a single course by ID
     * GET /api/courses/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.ok(ApiResponse.success("Successfully retrieved course", CourseMapper.toResponse(course))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Course not found")));
    }
    
    /**
     * Create a new course
     * POST /api/courses
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(@RequestBody CreateCourseRequest request) {
        Course course = CourseMapper.toEntity(request);
        Course createdCourse = courseService.createCourse(course);
        CourseResponse response = CourseMapper.toResponse(createdCourse);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created successfully", response));
    }
    
    /**
     * Update a course
     * PUT /api/courses/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id, 
            @RequestBody UpdateCourseRequest request) {
        Course course = CourseMapper.toEntity(request);
        Course updatedCourse = courseService.updateCourse(id, course);
        CourseResponse response = CourseMapper.toResponse(updatedCourse);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", response));
    }
    
    /**
     * Delete a course
     * DELETE /api/courses/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }
}
