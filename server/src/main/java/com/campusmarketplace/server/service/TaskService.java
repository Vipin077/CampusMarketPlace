package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TaskService {

    // =========================================================
    // CREATE TASK
    // =========================================================

    TaskResponse createTask(
            CreateTaskRequest request,
            MultipartFile attachment
    );

    // =========================================================
    // DOWNLOAD FILES
    // =========================================================

    // Download original task attachment
    Resource downloadAttachment(String taskId);

    // Download submitted work proof
    Resource downloadProof(String taskId);

    // =========================================================
    // GET TASKS
    // =========================================================

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(String id);

    // =========================================================
    // UPDATE TASK
    // =========================================================

    TaskResponse updateTask(
            String id,
            CreateTaskRequest request,
            MultipartFile attachment
    ) throws IOException;

    // =========================================================
    // ACCEPT TASK
    // =========================================================

    TaskResponse acceptTask(String taskId);

    // Tasks accepted by current user
    List<TaskResponse> getAcceptedTasks();

    // =========================================================
    // SUBMIT WORK
    // =========================================================

    TaskResponse submitWork(
            String taskId,
            String completionMessage,
            MultipartFile proof
    ) throws IOException;

    // =========================================================
    // APPROVE / REJECT WORK
    // =========================================================

    TaskResponse approveTask(String taskId);

    TaskResponse rejectTask(String taskId);

    // =========================================================
    // RATE COMPLETED TASK
    // =========================================================

    TaskResponse rateTask(
            String taskId,
            Integer rating,
            String review
    );

    // =========================================================
    // DELETE TASK
    // =========================================================

    void deleteTask(String id);

    // =========================================================
    // MY TASKS
    // =========================================================

    List<TaskResponse> getMyTasks();

    // =========================================================
    // EXPLORE TASKS
    // =========================================================

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