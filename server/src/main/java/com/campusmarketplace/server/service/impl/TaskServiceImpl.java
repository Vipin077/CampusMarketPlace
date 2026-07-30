package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;
import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.exception.TaskNotFoundException;
import com.campusmarketplace.server.exception.UnauthorizedException;
import com.campusmarketplace.server.mapper.TaskMapper;
import com.campusmarketplace.server.repository.TaskRepository;
import com.campusmarketplace.server.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    private final TaskMapper taskMapper;

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

        return taskMapper.toResponse(savedTask);
    }

    @Override
    public List<TaskResponse> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse getTaskById(String id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        return taskMapper.toResponse(task);
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

        return taskMapper.toResponse(updatedTask);
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

    @Override
    public List<TaskResponse> getMyTasks() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String currentUser = authentication.getName();

        return taskRepository.findByCreatedBy(currentUser)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TaskResponse> exploreTasks(
            String search,
            String category,
            Double minBudget,
            Double maxBudget,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String currentUser = authentication.getName();

        Page<Task> taskPage = taskRepository.exploreTasks(
                currentUser,
                search,
                category,
                minBudget,
                maxBudget,
                page,
                size,
                sortBy,
                direction
        );

        return taskPage.map(taskMapper::toResponse);
    }
}