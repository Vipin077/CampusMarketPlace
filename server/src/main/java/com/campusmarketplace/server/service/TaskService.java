package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TaskService {

    TaskResponse createTask(
            CreateTaskRequest request,
            MultipartFile attachment
    );

    // Download original task attachment
    Resource downloadAttachment(String taskId);

    // Download submitted work proof
    Resource downloadProof(String taskId);

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(String id);

    TaskResponse updateTask(
            String id,
            CreateTaskRequest request,
            MultipartFile attachment
    ) throws IOException;

    // Accept a task
    TaskResponse acceptTask(String taskId);

    // Tasks accepted by current user
    List<TaskResponse> getAcceptedTasks();

    // Submit completed work
    TaskResponse submitWork(
            String taskId,
            String completionMessage,
            MultipartFile proof
    ) throws IOException;

    // Approve submitted work
    TaskResponse approveTask(String taskId);

    // Reject submitted work
    TaskResponse rejectTask(String taskId);

    // Delete task
    void deleteTask(String id);

    // Tasks created by current user
    List<TaskResponse> getMyTasks();

    // Explore available tasks
    Page<TaskResponse> exploreTasks(
            String search,
            String category,
            Double minBudget,
            Double maxBudget,
            int page,
            int size,
            String sortBy,
            String direction
    );
}