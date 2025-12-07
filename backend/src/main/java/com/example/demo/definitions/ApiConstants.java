package com.example.demo.definitions;

/**
 * API constants definition
 */
public class ApiConstants {
    
    // API path prefix
    public static final String API_PREFIX = "/api";
    
    // Course-related paths
    public static final String COURSES_PATH = API_PREFIX + "/courses";
    public static final String COURSES_FEATURED_PATH = COURSES_PATH + "/featured";
    
    // Pagination related
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    
    // Validation related
    public static final int MAX_TITLE_LENGTH = 200;
    public static final int MAX_SUBTITLE_LENGTH = 200;
    public static final int MAX_DESCRIPTION_LENGTH = 1000;
    
    private ApiConstants() {
        // Prevent instantiation
    }
}
