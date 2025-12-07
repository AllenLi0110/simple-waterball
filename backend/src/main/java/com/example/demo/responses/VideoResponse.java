package com.example.demo.responses;

/**
 * Video response DTO
 */
public class VideoResponse {
    
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private Integer orderIndex;
    private Integer duration;
    
    // Constructor
    public VideoResponse() {}
    
    public VideoResponse(Long id, String title, String description, String videoUrl, 
                        Integer orderIndex, Integer duration) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.orderIndex = orderIndex;
        this.duration = duration;
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
    
    public String getVideoUrl() {
        return videoUrl;
    }
    
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}
