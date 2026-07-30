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

    private String status;

    private String createdBy;

   
    private String assignedTo;

    
    private LocalDateTime acceptedAt;

    private String attachmentUrl;

    private LocalDateTime createdAt;
}