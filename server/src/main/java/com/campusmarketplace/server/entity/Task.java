package com.campusmarketplace.server.entity;

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

    // OPEN, IN_PROGRESS, SUBMITTED, COMPLETED
    private String status;

    // Task creator
    private String createdBy;

    // User who accepted the task
    private String assignedTo;

    // Time when task was accepted
    private LocalDateTime acceptedAt;

    // Original task attachment
    private String attachmentUrl;
    // Proof uploaded after completing the task
    private String proofUrl;

    // Message submitted along with proof
    private String completionMessage;

    // Time when work was submitted
    private LocalDateTime submittedAt;

    // Task creation time
    private LocalDateTime createdAt;
}