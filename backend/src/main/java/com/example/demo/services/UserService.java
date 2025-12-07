package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.responses.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Service layer for User operations
 */
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get user by ID
     * @param id user ID
     * @return UserResponse
     * @throws IllegalArgumentException if user not found
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return convertToResponse(user);
    }
    
    /**
     * Update user profile
     * @param id user ID
     * @param name name
     * @param gender gender
     * @param nickname nickname
     * @param occupation occupation
     * @param birthday birthday
     * @param location location
     * @param githubLink github link
     * @param avatarUrl avatar URL
     * @return UserResponse
     * @throws IllegalArgumentException if user not found
     */
    public UserResponse updateUser(Long id, String name, String gender, String nickname, 
                                   String occupation, LocalDate birthday, String location, 
                                   String githubLink, String avatarUrl) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (name != null) {
            // Name is required, so always update if provided
            user.setName(name.trim());
        }
        if (gender != null) {
            user.setGender(gender.trim().isEmpty() ? null : gender);
        }
        if (nickname != null) {
            user.setNickname(nickname.trim().isEmpty() ? null : nickname);
        }
        if (occupation != null) {
            user.setOccupation(occupation.trim().isEmpty() ? null : occupation);
        }
        if (birthday != null) {
            user.setBirthday(birthday);
        }
        if (location != null) {
            user.setLocation(location.trim().isEmpty() ? null : location);
        }
        if (githubLink != null) {
            user.setGithubLink(githubLink.trim().isEmpty() ? null : githubLink);
        }
        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl.trim().isEmpty() ? null : avatarUrl);
        }
        
        user = userRepository.save(user);
        return convertToResponse(user);
    }
    
    /**
     * Convert User entity to UserResponse
     */
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse(
            user.getId(),
            user.getName(),
            user.getUsername(),
            user.getCreatedAt()
        );
        response.setGender(user.getGender());
        response.setNickname(user.getNickname());
        response.setOccupation(user.getOccupation());
        response.setBirthday(user.getBirthday());
        response.setLocation(user.getLocation());
        response.setGithubLink(user.getGithubLink());
        response.setAvatarUrl(user.getAvatarUrl());
        return response;
    }
}
