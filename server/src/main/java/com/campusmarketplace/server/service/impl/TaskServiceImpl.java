package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;
import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.exception.TaskNotFoundException;
import com.campusmarketplace.server.exception.UnauthorizedException;
import com.campusmarketplace.server.mapper.TaskMapper;
import com.campusmarketplace.server.repository.TaskRepository;
import com.campusmarketplace.server.service.FileStorageService;
import com.campusmarketplace.server.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final FileStorageService fileStorageService;

    @Override
    public TaskResponse createTask(
            CreateTaskRequest request,
            MultipartFile attachment
    ) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        String attachmentUrl = fileStorageService.store(
                attachment,
                "task-files"
        );

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .budget(request.getBudget())
                .category(request.getCategory())
                .location(request.getLocation())
                .status("OPEN")
                .createdBy(email)
                .attachmentUrl(attachmentUrl)
                .createdAt(LocalDateTime.now())
                .build();

        Task savedTask = taskRepository.save(task);

        return taskMapper.toResponse(savedTask);
    }

    @Override
    public Resource downloadAttachment(String taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        if (task.getAttachmentUrl() == null) {
            throw new RuntimeException("No attachment found");
        }

        String fileName = fileStorageService.getFileName(
                task.getAttachmentUrl()
        );

        return fileStorageService.load(
                fileName,
                "task-files"
        );
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
    public TaskResponse updateTask(
            String id,
            CreateTaskRequest request,
            MultipartFile attachment
    ) throws IOException {

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

        // Replace attachment only if a new one is uploaded
        if (attachment != null && !attachment.isEmpty()) {

            // Delete old attachment
            if (task.getAttachmentUrl() != null) {

                String oldFileName = fileStorageService.getFileName(
                        task.getAttachmentUrl()
                );

                fileStorageService.delete(
                        oldFileName,
                        "task-files"
                );
            }

            // Upload new attachment
            String newAttachmentUrl = fileStorageService.store(
                    attachment,
                    "task-files"
            );

            task.setAttachmentUrl(newAttachmentUrl);
        }

        Task updatedTask = taskRepository.save(task);

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public TaskResponse acceptTask(String taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String currentUser = authentication.getName();

        // Owner cannot accept own task
        if (task.getCreatedBy().equals(currentUser)) {
            throw new UnauthorizedException("You cannot accept your own task");
        }

        // Task must be OPEN
        if (!"OPEN".equals(task.getStatus())) {
            throw new RuntimeException("Task has already been accepted");
        }

        task.setAssignedTo(currentUser);
        task.setAcceptedAt(LocalDateTime.now());
        task.setStatus("IN_PROGRESS");

        Task updatedTask = taskRepository.save(task);

        return taskMapper.toResponse(updatedTask);
    }


    @Override
    public List<TaskResponse> getAcceptedTasks() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String currentUser = authentication.getName();

        return taskRepository.findByAssignedTo(currentUser)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
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

        if (task.getAttachmentUrl() != null) {

            String fileName = fileStorageService.getFileName(
                    task.getAttachmentUrl()
            );

            fileStorageService.delete(
                    fileName,
                    "task-files"
            );
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