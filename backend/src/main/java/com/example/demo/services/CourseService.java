package com.example.demo.services;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Course;
import com.example.demo.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Course, handles business logic
 */
@Service
@Transactional
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    /**
     * Get all courses with chapters and videos
     */
    public List<Course> getAllCourses() {
        try {
            // Use standard findAll() method
            List<Course> courses = courseRepository.findAll();
            System.out.println("Found " + courses.size() + " courses");
            return courses;
        } catch (Exception e) {
            System.err.println("Error fetching courses: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Get a single course by ID with chapters and videos
     */
    public Optional<Course> getCourseById(Long id) {
        try {
            Optional<Course> courseOpt = courseRepository.findById(id);
            System.out.println("Course found: " + courseOpt.isPresent());
            return courseOpt;
        } catch (Exception e) {
            System.err.println("Error fetching course by id: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Create a new course
     */
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }
    
    /**
     * Update a course
     */
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        course.setTitle(courseDetails.getTitle());
        course.setSubtitle(courseDetails.getSubtitle());
        course.setDescription(courseDetails.getDescription());
        course.setPriceText(courseDetails.getPriceText());
        course.setButtonLabel(courseDetails.getButtonLabel());
        course.setImageUrl(courseDetails.getImageUrl());
        course.setImageSubtitle(courseDetails.getImageSubtitle());
        course.setIsFeatured(courseDetails.getIsFeatured());
        
        return courseRepository.save(course);
    }
    
    /**
     * Delete a course
     */
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        courseRepository.delete(course);
    }
    
    /**
     * Get featured courses with chapters and videos
     */
    public List<Course> getFeaturedCourses() {
        try {
            List<Course> courses = courseRepository.findByIsFeaturedTrue();
            System.out.println("Found " + courses.size() + " featured courses");
            return courses;
        } catch (Exception e) {
            System.err.println("Error fetching featured courses: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
