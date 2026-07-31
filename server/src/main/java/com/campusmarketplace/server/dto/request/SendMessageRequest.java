package com.campusmarketplace.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotBlank(message = "Receiver email is required")
    private String receiverEmail;

    @NotBlank(message = "Message cannot be empty")
    private String content;

    // Optional: if conversation started from a task
    private String taskId;
}