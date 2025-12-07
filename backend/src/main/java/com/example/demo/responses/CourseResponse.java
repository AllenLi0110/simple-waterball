package com.example.demo.responses;

import java.util.ArrayList;
import java.util.List;

/**
 * Course response DTO
 */
public class CourseResponse {
    
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private String priceText;
    private String buttonLabel;
    private String imageUrl;
    private String imageSubtitle;
    private Boolean isFeatured;
    private List<ChapterResponse> chapters = new ArrayList<>();
    
    // Constructor
    public CourseResponse() {}
    
    public CourseResponse(Long id, String title, String subtitle, String description, 
                         String priceText, String buttonLabel, String imageUrl, 
                         String imageSubtitle, Boolean isFeatured, List<ChapterResponse> chapters) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.priceText = priceText;
        this.buttonLabel = buttonLabel;
        this.imageUrl = imageUrl;
        this.imageSubtitle = imageSubtitle;
        this.isFeatured = isFeatured;
        this.chapters = chapters != null ? chapters : new ArrayList<>();
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
    
    public String getSubtitle() {
        return subtitle;
    }
    
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPriceText() {
        return priceText;
    }
    
    public void setPriceText(String priceText) {
        this.priceText = priceText;
    }
    
    public String getButtonLabel() {
        return buttonLabel;
    }
    
    public void setButtonLabel(String buttonLabel) {
        this.buttonLabel = buttonLabel;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getImageSubtitle() {
        return imageSubtitle;
    }
    
    public void setImageSubtitle(String imageSubtitle) {
        this.imageSubtitle = imageSubtitle;
    }
    
    public Boolean getIsFeatured() {
        return isFeatured;
    }
    
    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }
    
    public List<ChapterResponse> getChapters() {
        return chapters;
    }
    
    public void setChapters(List<ChapterResponse> chapters) {
        this.chapters = chapters != null ? chapters : new ArrayList<>();
    }
}
