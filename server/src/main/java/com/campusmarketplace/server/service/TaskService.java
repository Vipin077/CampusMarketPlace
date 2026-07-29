package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(String id);

    TaskResponse updateTask(String id, CreateTaskRequest request);

    void deleteTask(String id);
}
