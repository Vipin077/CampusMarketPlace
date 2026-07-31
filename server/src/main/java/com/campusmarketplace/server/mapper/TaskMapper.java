package com.campusmarketplace.server.mapper;

import com.campusmarketplace.server.dto.response.TaskResponse;
import com.campusmarketplace.server.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .budget(task.getBudget())
                .category(task.getCategory())
                .location(task.getLocation())
                .status(task.getStatus())
                .createdBy(task.getCreatedBy())

                // User who accepted the task
                .assignedTo(task.getAssignedTo())
                .acceptedAt(task.getAcceptedAt())

                // Original attachment
                .attachmentUrl(task.getAttachmentUrl())

                // Submission details
                .proofUrl(task.getProofUrl())
                .completionMessage(task.getCompletionMessage())
                .submittedAt(task.getSubmittedAt())

                // Task creation time
                .createdAt(task.getCreatedAt())

                .build();
    }
}