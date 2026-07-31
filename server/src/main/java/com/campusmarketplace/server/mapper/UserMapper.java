package com.campusmarketplace.server.mapper;

import com.campusmarketplace.server.dto.response.UserResponse;
import com.campusmarketplace.server.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .department(user.getDepartment())
                .year(user.getYear())
                .rating(user.getRating())
                .completedTasks(user.getCompletedTasks())
                .activeTasks(user.getActiveTasks())
                .joinedAt(
                        user.getJoinedAt() != null
                                ? user.getJoinedAt().toString()
                                : null
                )
                .build();
    }
}