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
public class MessageResponse {

    private String id;

    private String senderEmail;

    private String receiverEmail;

    private String content;

    private String taskId;

    private boolean read;

    private LocalDateTime createdAt;
}