package com.campusmarketplace.server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String fullName;

    private String email;

    private String password;

    private String role;

    // Profile
    private String profilePicture;

    private String bio;

    private String department;

    private String year;

    // Marketplace Stats
    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer completedTasks = 0;

    @Builder.Default
    private Integer activeTasks = 0;

    @Builder.Default
    private LocalDateTime joinedAt = LocalDateTime.now();
}