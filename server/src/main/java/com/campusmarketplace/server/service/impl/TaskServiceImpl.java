package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;
import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.exception.TaskNotFoundException;
import com.campusmarketplace.server.exception.UnauthorizedException;
import com.campusmarketplace.server.repository.TaskRepository;
import com.campusmarketplace.server.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public TaskResponse createTask(CreateTaskRequest request) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .budget(request.getBudget())
                .category(request.getCategory())
                .location(request.getLocation())
                .status("OPEN")
                .createdBy(email)
                .createdAt(LocalDateTime.now())
                .build();

        Task savedTask = taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    @Override
    public List<TaskResponse> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse getTaskById(String id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        return mapToResponse(task);
    }

    @Override
    public TaskResponse updateTask(String id, CreateTaskRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String currentUser = authentication.getName();

        if (!task.getCreatedBy().equals(currentUser)) {
            throw new UnauthorizedException("You are not authorized to update this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setBudget(request.getBudget());
        task.setCategory(request.getCategory());
        task.setLocation(request.getLocation());

        Task updatedTask = taskRepository.save(task);

        return mapToResponse(updatedTask);
    }

    @Override
    public void deleteTask(String id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String currentUser = authentication.getName();

        if (!task.getCreatedBy().equals(currentUser)) {
            throw new UnauthorizedException("You are not authorized to delete this task");
        }

        taskRepository.delete(task);
    }

    private TaskResponse mapToResponse(Task task) {

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .budget(task.getBudget())
                .category(task.getCategory())
                .location(task.getLocation())
                .status(task.getStatus())
                .createdBy(task.getCreatedBy())
                .createdAt(task.getCreatedAt())
                .build();
    }
}