package com.example.demo.apps;

/**
 * DEPRECATED: Data initialization moved to SQL script
 * 
 * This class previously initialized course data using Java code.
 * It has been replaced with data.sql for better separation of concerns.
 * 
 * Data is now initialized via: src/main/resources/data.sql
 * The SQL script runs automatically when the application starts.
 * 
 * This class is kept for reference but is completely disabled.
 * All code is commented out to prevent execution.
 * 
 * To re-enable (not recommended), uncomment the code below and add @Component annotation.
 */

// All imports and class implementation are commented out
// Data initialization is now handled by data.sql

/*
import com.example.demo.models.Chapter;
import com.example.demo.models.Course;
import com.example.demo.models.Video;
import com.example.demo.repositories.ChapterRepository;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private ChapterRepository chapterRepository;
    
    @Autowired
    private VideoRepository videoRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Original implementation removed
        // See src/main/resources/data.sql for data initialization
    }
}
*/
