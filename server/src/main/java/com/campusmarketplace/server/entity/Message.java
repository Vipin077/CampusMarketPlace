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
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    // Sender email
    private String senderEmail;

    // Receiver email
    private String receiverEmail;

    // Message text
    private String content;

    // Optional task context
    private String taskId;

    // For unread messages
    private boolean read;

    private LocalDateTime createdAt;
}