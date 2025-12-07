package com.example.demo.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Course entity class, maps to the courses table in the database
 */
@Entity
@Table(name = "courses")
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    private String subtitle;
    
    @Column(length = 1000)
    private String description;
    
    private String priceText;
    
    private String buttonLabel;
    
    private String imageUrl;
    
    private String imageSubtitle;
    
    private Boolean isFeatured;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Chapter> chapters = new ArrayList<>();
    
    // Default constructor
    public Course() {}
    
    // Getter and Setter methods
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
    
    public List<Chapter> getChapters() {
        return chapters;
    }
    
    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
    }
}
