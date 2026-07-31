package com.campusmarketplace.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private String id;

    private String title;

    private String description;

    private Double budget;

    private String category;

    private String location;

    // OPEN, IN_PROGRESS, SUBMITTED, COMPLETED
    private String status;

    // Task creator email
    private String createdBy;

    // Task creator profile
    private UserResponse owner;

    // User who accepted the task
    private String assignedTo;

    // Time when task was accepted
    private LocalDateTime acceptedAt;

    // Original task attachment
    private String attachmentUrl;

    // Proof uploaded after completing the task
    private String proofUrl;

    // Completion message submitted by the assignee
    private String completionMessage;

    // Time when work was submitted
    private LocalDateTime submittedAt;

    // =========================================================
    // RATING
    // =========================================================

    // Rating given to the assigned user (1 - 5)
    private Integer rating;

    // Optional review/comment
    private String review;

    // Time when rating was submitted
    private LocalDateTime ratedAt;

    // Task creation time
    private LocalDateTime createdAt;
}