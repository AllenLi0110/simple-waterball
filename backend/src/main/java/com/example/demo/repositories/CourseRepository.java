package com.example.demo.repositories;

import com.example.demo.models.Course;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Course, provides database operations
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    /**
     * Query all featured courses
     */
    List<Course> findByIsFeaturedTrue();
    
    /**
     * Find course by ID with chapters and videos loaded
     */
    @EntityGraph(attributePaths = {"chapters", "chapters.videos"})
    @Query("SELECT c FROM Course c WHERE c.id = :id")
    Optional<Course> findByIdWithChaptersAndVideos(Long id);
    
    /**
     * Find all courses with chapters and videos loaded
     */
    @EntityGraph(attributePaths = {"chapters", "chapters.videos"})
    @Query("SELECT c FROM Course c")
    List<Course> findAllWithChaptersAndVideos();
    
    /**
     * Find featured courses with chapters and videos loaded
     */
    @EntityGraph(attributePaths = {"chapters", "chapters.videos"})
    @Query("SELECT c FROM Course c WHERE c.isFeatured = true")
    List<Course> findFeaturedCoursesWithChaptersAndVideos();
}
