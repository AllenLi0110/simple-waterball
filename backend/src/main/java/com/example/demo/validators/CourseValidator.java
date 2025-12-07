package com.example.demo.validators;

import com.example.demo.definitions.ApiConstants;
import com.example.demo.requests.CreateCourseRequest;
import com.example.demo.requests.UpdateCourseRequest;
import org.springframework.stereotype.Component;

/**
 * Course validator
 */
@Component
public class CourseValidator {
    
    /**
     * Validate create course request
     */
    public void validateCreateRequest(CreateCourseRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Course title cannot be empty");
        }
        
        if (request.getTitle().length() > ApiConstants.MAX_TITLE_LENGTH) {
            throw new IllegalArgumentException("Course title length cannot exceed " + ApiConstants.MAX_TITLE_LENGTH + " characters");
        }
        
        if (request.getSubtitle() != null && request.getSubtitle().length() > ApiConstants.MAX_SUBTITLE_LENGTH) {
            throw new IllegalArgumentException("Subtitle length cannot exceed " + ApiConstants.MAX_SUBTITLE_LENGTH + " characters");
        }
        
        if (request.getDescription() != null && request.getDescription().length() > ApiConstants.MAX_DESCRIPTION_LENGTH) {
            throw new IllegalArgumentException("Description length cannot exceed " + ApiConstants.MAX_DESCRIPTION_LENGTH + " characters");
        }
    }
    
    /**
     * Validate update course request
     */
    public void validateUpdateRequest(UpdateCourseRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        if (request.getTitle() != null && request.getTitle().length() > ApiConstants.MAX_TITLE_LENGTH) {
            throw new IllegalArgumentException("Course title length cannot exceed " + ApiConstants.MAX_TITLE_LENGTH + " characters");
        }
        
        if (request.getSubtitle() != null && request.getSubtitle().length() > ApiConstants.MAX_SUBTITLE_LENGTH) {
            throw new IllegalArgumentException("Subtitle length cannot exceed " + ApiConstants.MAX_SUBTITLE_LENGTH + " characters");
        }
        
        if (request.getDescription() != null && request.getDescription().length() > ApiConstants.MAX_DESCRIPTION_LENGTH) {
            throw new IllegalArgumentException("Description length cannot exceed " + ApiConstants.MAX_DESCRIPTION_LENGTH + " characters");
        }
    }
}
