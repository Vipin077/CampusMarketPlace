package com.campusmarketplace.server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    // User who will receive this notification
    private String recipientEmail;

    // ACCEPTED, SUBMITTED, APPROVED, REJECTED
    private String type;

    // Notification heading
    private String title;

    // Notification description
    private String message;

    // Related task
    private String taskId;

    // false = unread, true = read
    private boolean read;

    // Notification creation time
    private LocalDateTime createdAt;
}