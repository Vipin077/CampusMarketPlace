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
public class NotificationResponse {

    private String id;

    // ACCEPTED, SUBMITTED, APPROVED, REJECTED
    private String type;

    private String title;

    private String message;

    // Related task
    private String taskId;

    // Read / unread status
    private boolean read;

    private LocalDateTime createdAt;
}