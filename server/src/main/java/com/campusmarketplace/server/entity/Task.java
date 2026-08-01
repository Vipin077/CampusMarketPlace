package com.campusmarketplace.server.entity;

import com.campusmarketplace.server.entity.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String title;

    private String description;

    private Double budget;

    private String category;

    private String location;

    /**
     * Status Flow:
     * OPEN
     * PENDING_APPROVAL
     * IN_PROGRESS
     * SUBMITTED
     * COMPLETED
     * CANCELLED
     * EXPIRED
     */
    private TaskStatus status;

    // Task creator
    private String createdBy;

    // User selected by the owner to perform the task
    private String assignedTo;

    // Time when user requested the task
    private LocalDateTime acceptedAt;

    // Time when owner approved the request
    private LocalDateTime approvedAt;

    // Deadline for completing task
    private LocalDateTime deadline;

    // Original task attachment
    private String attachmentUrl;

    // Proof uploaded after completing the task
    private String proofUrl;

    // Message submitted with proof
    private String completionMessage;

    // Time when work was submitted
    private LocalDateTime submittedAt;

    // =========================================================
    // RATING
    // =========================================================

    // Rating given by task creator to assigned user (1-5)
    private Integer rating;

    // Optional review
    private String review;

    // Time when rating was submitted
    private LocalDateTime ratedAt;

    // Task creation time
    private LocalDateTime createdAt;
}