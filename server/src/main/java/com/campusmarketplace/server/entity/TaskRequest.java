package com.campusmarketplace.server.entity;

import com.campusmarketplace.server.entity.enums.RequestStatus;
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
@Document(collection = "task_requests")
public class TaskRequest {

    @Id
    private String id;

    // Task for which request is made
    private String taskId;

    // Email of the requester
    private String requesterId;

    // Email of task owner
    private String ownerId;

    // Optional message from requester
    private String message;

    // PENDING, APPROVED, REJECTED
    private RequestStatus status;

    // Request creation time
    private LocalDateTime requestedAt;

    // Approval/Rejection time
    private LocalDateTime respondedAt;
}