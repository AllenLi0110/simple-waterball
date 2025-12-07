package com.example.demo.utils;

import com.example.demo.models.Chapter;
import com.example.demo.models.Course;
import com.example.demo.models.Video;
import com.example.demo.requests.CreateCourseRequest;
import com.example.demo.requests.UpdateCourseRequest;
import com.example.demo.responses.ChapterResponse;
import com.example.demo.responses.CourseResponse;
import com.example.demo.responses.VideoResponse;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for converting between Course entity and DTOs
 */
public class CourseMapper {
    
    /**
     * Convert Course entity to CourseResponse
     */
    public static CourseResponse toResponse(Course course) {
        if (course == null) {
            return null;
        }
        
        List<ChapterResponse> chapterResponses = null;
        if (course.getChapters() != null) {
            chapterResponses = course.getChapters().stream()
                    .map(CourseMapper::toChapterResponse)
                    .collect(Collectors.toList());
        }
        
        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getSubtitle(),
                course.getDescription(),
                course.getPriceText(),
                course.getButtonLabel(),
                course.getImageUrl(),
                course.getImageSubtitle(),
                course.getIsFeatured(),
                chapterResponses
        );
    }
    
    /**
     * Convert Chapter entity to ChapterResponse
     */
    public static ChapterResponse toChapterResponse(Chapter chapter) {
        if (chapter == null) {
            return null;
        }
        
        List<VideoResponse> videoResponses = null;
        if (chapter.getVideos() != null) {
            videoResponses = chapter.getVideos().stream()
                    .map(CourseMapper::toVideoResponse)
                    .collect(Collectors.toList());
        }
        
        return new ChapterResponse(
                chapter.getId(),
                chapter.getTitle(),
                chapter.getDescription(),
                chapter.getOrderIndex(),
                videoResponses
        );
    }
    
    /**
     * Convert Video entity to VideoResponse
     */
    public static VideoResponse toVideoResponse(Video video) {
        if (video == null) {
            return null;
        }
        
        return new VideoResponse(
                video.getId(),
                video.getTitle(),
                video.getDescription(),
                video.getVideoUrl(),
                video.getOrderIndex(),
                video.getDuration()
        );
    }
    
    /**
     * Convert CreateCourseRequest to Course entity
     */
    public static Course toEntity(CreateCourseRequest request) {
        if (request == null) {
            return null;
        }
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setSubtitle(request.getSubtitle());
        course.setDescription(request.getDescription());
        course.setPriceText(request.getPriceText());
        course.setButtonLabel(request.getButtonLabel());
        course.setImageUrl(request.getImageUrl());
        course.setImageSubtitle(request.getImageSubtitle());
        course.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        return course;
    }
    
    /**
     * Convert UpdateCourseRequest to Course entity
     */
    public static Course toEntity(UpdateCourseRequest request) {
        if (request == null) {
            return null;
        }
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setSubtitle(request.getSubtitle());
        course.setDescription(request.getDescription());
        course.setPriceText(request.getPriceText());
        course.setButtonLabel(request.getButtonLabel());
        course.setImageUrl(request.getImageUrl());
        course.setImageSubtitle(request.getImageSubtitle());
        course.setIsFeatured(request.getIsFeatured());
        return course;
    }
}
