package com.example.demo.requests;

/**
 * Request DTO for updating a course
 */
public class UpdateCourseRequest {
    
    private String title;
    
    private String subtitle;
    
    private String description;
    
    private String priceText;
    
    private String buttonLabel;
    
    private String imageUrl;
    
    private String imageSubtitle;
    
    private Boolean isFeatured;
    
    // Getters and Setters
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
}
