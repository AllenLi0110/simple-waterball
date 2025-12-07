package com.example.demo.utils;

import com.example.demo.models.Chapter;
import com.example.demo.models.Course;
import com.example.demo.models.Video;
import com.example.demo.requests.CreateCourseRequest;
import com.example.demo.requests.UpdateCourseRequest;
import com.example.demo.responses.ChapterResponse;
import com.example.demo.responses.CourseResponse;
import com.example.demo.responses.VideoResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for CourseMapper utility class
 */
class CourseMapperTest {

    private Course testCourse;
    private Chapter testChapter;
    private Video testVideo;

    @BeforeEach
    void setUp() {
        // Create test course
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

        // Create test chapter
        testChapter = new Chapter();
        testChapter.setId(1L);
        testChapter.setTitle("Test Chapter");
        testChapter.setDescription("Test Chapter Description");
        testChapter.setOrderIndex(1);
        testChapter.setCourse(testCourse);

        // Create test video
        testVideo = new Video();
        testVideo.setId(1L);
        testVideo.setTitle("Test Video");
        testVideo.setDescription("Test Video Description");
        testVideo.setVideoUrl("https://example.com/video.mp4");
        testVideo.setOrderIndex(1);
        testVideo.setDuration(600);
        testVideo.setChapter(testChapter);

        // Link relationships
        List<Video> videos = new ArrayList<>();
        videos.add(testVideo);
        testChapter.setVideos(videos);

        List<Chapter> chapters = new ArrayList<>();
        chapters.add(testChapter);
        testCourse.setChapters(chapters);
    }

    @Test
    void shouldConvertCourseToResponse() {
        // When
        CourseResponse response = CourseMapper.toResponse(testCourse);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Course", response.getTitle());
        assertEquals("Test Subtitle", response.getSubtitle());
        assertEquals("Test Description", response.getDescription());
        assertEquals("NT$ 1,000", response.getPriceText());
        assertEquals("Buy Now", response.getButtonLabel());
        assertEquals("/images/test.png", response.getImageUrl());
        assertEquals("Test Image", response.getImageSubtitle());
        assertTrue(response.getIsFeatured());
        assertNotNull(response.getChapters());
        assertEquals(1, response.getChapters().size());
    }

    @Test
    void shouldReturnNullWhenCourseIsNull() {
        // When
        CourseResponse response = CourseMapper.toResponse(null);

        // Then
        assertNull(response);
    }

    @Test
    void shouldConvertChapterToResponse() {
        // When
        ChapterResponse response = CourseMapper.toChapterResponse(testChapter);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Chapter", response.getTitle());
        assertEquals("Test Chapter Description", response.getDescription());
        assertEquals(1, response.getOrderIndex());
        assertNotNull(response.getVideos());
        assertEquals(1, response.getVideos().size());
    }

    @Test
    void shouldReturnNullWhenChapterIsNull() {
        // When
        ChapterResponse response = CourseMapper.toChapterResponse(null);

        // Then
        assertNull(response);
    }

    @Test
    void shouldConvertVideoToResponse() {
        // When
        VideoResponse response = CourseMapper.toVideoResponse(testVideo);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Video", response.getTitle());
        assertEquals("Test Video Description", response.getDescription());
        assertEquals("https://example.com/video.mp4", response.getVideoUrl());
        assertEquals(1, response.getOrderIndex());
        assertEquals(600, response.getDuration());
    }

    @Test
    void shouldReturnNullWhenVideoIsNull() {
        // When
        VideoResponse response = CourseMapper.toVideoResponse(null);

        // Then
        assertNull(response);
    }

    @Test
    void shouldConvertCreateCourseRequestToEntity() {
        // Given
        CreateCourseRequest request = new CreateCourseRequest();
        request.setTitle("New Course");
        request.setSubtitle("New Subtitle");
        request.setDescription("New Description");
        request.setPriceText("NT$ 2,000");
        request.setButtonLabel("Buy");
        request.setImageUrl("/images/new.png");
        request.setImageSubtitle("New Image");
        request.setIsFeatured(true);

        // When
        Course course = CourseMapper.toEntity(request);

        // Then
        assertNotNull(course);
        assertEquals("New Course", course.getTitle());
        assertEquals("New Subtitle", course.getSubtitle());
        assertEquals("New Description", course.getDescription());
        assertEquals("NT$ 2,000", course.getPriceText());
        assertEquals("Buy", course.getButtonLabel());
        assertEquals("/images/new.png", course.getImageUrl());
        assertEquals("New Image", course.getImageSubtitle());
        assertTrue(course.getIsFeatured());
    }

    @Test
    void shouldReturnNullWhenCreateRequestIsNull() {
        // When
        Course course = CourseMapper.toEntity((CreateCourseRequest) null);

        // Then
        assertNull(course);
    }

    @Test
    void shouldConvertUpdateCourseRequestToEntity() {
        // Given
        UpdateCourseRequest request = new UpdateCourseRequest();
        request.setTitle("Updated Course");
        request.setSubtitle("Updated Subtitle");
        request.setDescription("Updated Description");
        request.setPriceText("NT$ 3,000");
        request.setButtonLabel("Update");
        request.setImageUrl("/images/updated.png");
        request.setImageSubtitle("Updated Image");
        request.setIsFeatured(false);

        // When
        Course course = CourseMapper.toEntity(request);

        // Then
        assertNotNull(course);
        assertEquals("Updated Course", course.getTitle());
        assertEquals("Updated Subtitle", course.getSubtitle());
        assertEquals("Updated Description", course.getDescription());
        assertEquals("NT$ 3,000", course.getPriceText());
        assertEquals("Update", course.getButtonLabel());
        assertEquals("/images/updated.png", course.getImageUrl());
        assertEquals("Updated Image", course.getImageSubtitle());
        assertFalse(course.getIsFeatured());
    }

    @Test
    void shouldReturnNullWhenUpdateRequestIsNull() {
        // When
        Course course = CourseMapper.toEntity((UpdateCourseRequest) null);

        // Then
        assertNull(course);
    }

    @Test
    void shouldHandleCourseWithNullChapters() {
        // Given
        Course courseWithoutChapters = new Course();
        courseWithoutChapters.setId(1L);
        courseWithoutChapters.setTitle("Course Without Chapters");
        courseWithoutChapters.setChapters(null);

        // When
        CourseResponse response = CourseMapper.toResponse(courseWithoutChapters);

        // Then
        assertNotNull(response);
        assertEquals("Course Without Chapters", response.getTitle());
        // CourseResponse constructor converts null to empty list
        assertNotNull(response.getChapters());
        assertTrue(response.getChapters().isEmpty());
    }

    @Test
    void shouldHandleChapterWithNullVideos() {
        // Given
        Chapter chapterWithoutVideos = new Chapter();
        chapterWithoutVideos.setId(1L);
        chapterWithoutVideos.setTitle("Chapter Without Videos");
        chapterWithoutVideos.setVideos(null);

        // When
        ChapterResponse response = CourseMapper.toChapterResponse(chapterWithoutVideos);

        // Then
        assertNotNull(response);
        assertEquals("Chapter Without Videos", response.getTitle());
        // ChapterResponse constructor converts null to empty list
        assertNotNull(response.getVideos());
        assertTrue(response.getVideos().isEmpty());
    }
}
