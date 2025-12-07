package com.example.demo.responses;

import java.util.ArrayList;
import java.util.List;

/**
 * Chapter response DTO
 */
public class ChapterResponse {
    
    private Long id;
    private String title;
    private String description;
    private Integer orderIndex;
    private List<VideoResponse> videos = new ArrayList<>();
    
    // Constructor
    public ChapterResponse() {}
    
    public ChapterResponse(Long id, String title, String description, Integer orderIndex, List<VideoResponse> videos) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
        this.videos = videos != null ? videos : new ArrayList<>();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
    
    public List<VideoResponse> getVideos() {
        return videos;
    }
    
    public void setVideos(List<VideoResponse> videos) {
        this.videos = videos != null ? videos : new ArrayList<>();
    }
}
