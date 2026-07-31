package com.campusmarketplace.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private String id;

    private String fullName;

    private String email;

    private String role;

    // Profile
    private String profilePicture;

    private String bio;

    private String department;

    private String year;

    // Marketplace Stats
    private Double rating;

    private Integer completedTasks;

    private Integer activeTasks;

    private String joinedAt;
}