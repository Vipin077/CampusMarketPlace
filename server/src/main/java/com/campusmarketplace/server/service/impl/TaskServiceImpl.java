package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;
import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.exception.TaskNotFoundException;
import com.campusmarketplace.server.exception.UnauthorizedException;
import com.campusmarketplace.server.mapper.TaskMapper;
import com.campusmarketplace.server.repository.TaskRepository;
import com.campusmarketplace.server.service.FileStorageService;
import com.campusmarketplace.server.service.NotificationService;
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
    private final NotificationService notificationService;

    // =========================================================
    // CREATE TASK
    // =========================================================

    @Override
    public TaskResponse createTask(
            CreateTaskRequest request,
            MultipartFile attachment
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        String attachmentUrl =
                fileStorageService.store(
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

        Task savedTask =
                taskRepository.save(task);

        return taskMapper.toResponse(savedTask);
    }

    // =========================================================
    // DOWNLOAD ORIGINAL ATTACHMENT
    // =========================================================

    @Override
    public Resource downloadAttachment(
            String taskId
    ) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        if (task.getAttachmentUrl() == null ||
                task.getAttachmentUrl().isBlank()) {

            throw new RuntimeException(
                    "No attachment found"
            );
        }

        return fileStorageService.load(
                task.getAttachmentUrl(),
                "task-files"
        );
    }

    // =========================================================
    // DOWNLOAD SUBMITTED PROOF
    // =========================================================

    @Override
    public Resource downloadProof(
            String taskId
    ) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        if (task.getProofUrl() == null ||
                task.getProofUrl().isBlank()) {

            throw new RuntimeException(
                    "No proof found"
            );
        }

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        boolean isOwner =
                task.getCreatedBy()
                        .equals(currentUser);

        boolean isAssignedUser =
                task.getAssignedTo() != null &&
                        task.getAssignedTo()
                                .equals(currentUser);

        if (!isOwner && !isAssignedUser) {

            throw new UnauthorizedException(
                    "You are not authorized to access this proof"
            );
        }

        return fileStorageService.load(
                task.getProofUrl(),
                "task-proofs"
        );
    }

    // =========================================================
    // GET ALL TASKS
    // =========================================================

    @Override
    public List<TaskResponse> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET TASK BY ID
    // =========================================================

    @Override
    public TaskResponse getTaskById(
            String id
    ) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        return taskMapper.toResponse(task);
    }

    // =========================================================
    // UPDATE TASK
    // =========================================================

    @Override
    public TaskResponse updateTask(
            String id,
            CreateTaskRequest request,
            MultipartFile attachment
    ) throws IOException {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        if (!task.getCreatedBy()
                .equals(currentUser)) {

            throw new UnauthorizedException(
                    "You are not authorized to update this task"
            );
        }

        task.setTitle(
                request.getTitle()
        );

        task.setDescription(
                request.getDescription()
        );

        task.setBudget(
                request.getBudget()
        );

        task.setCategory(
                request.getCategory()
        );

        task.setLocation(
                request.getLocation()
        );

        if (attachment != null &&
                !attachment.isEmpty()) {

            if (task.getAttachmentUrl() != null &&
                    !task.getAttachmentUrl()
                            .isBlank()) {

                fileStorageService.delete(
                        task.getAttachmentUrl(),
                        "task-files"
                );
            }

            String newAttachmentUrl =
                    fileStorageService.store(
                            attachment,
                            "task-files"
                    );

            task.setAttachmentUrl(
                    newAttachmentUrl
            );
        }

        Task updatedTask =
                taskRepository.save(task);

        return taskMapper.toResponse(
                updatedTask
        );
    }

    // =========================================================
    // ACCEPT TASK
    // =========================================================

    @Override
    public TaskResponse acceptTask(
            String taskId
    ) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        if (task.getCreatedBy()
                .equals(currentUser)) {

            throw new UnauthorizedException(
                    "You cannot accept your own task"
            );
        }

        if (!"OPEN".equals(
                task.getStatus()
        )) {

            throw new RuntimeException(
                    "Task has already been accepted"
            );
        }

        task.setAssignedTo(
                currentUser
        );

        task.setAcceptedAt(
                LocalDateTime.now()
        );

        task.setStatus(
                "IN_PROGRESS"
        );

        Task updatedTask =
                taskRepository.save(task);

        notificationService.createNotification(
                task.getCreatedBy(),
                "ACCEPTED",
                "Task Accepted",
                currentUser +
                        " accepted your task \"" +
                        task.getTitle() +
                        "\".",
                task.getId()
        );

        return taskMapper.toResponse(
                updatedTask
        );
    }

    // =========================================================
    // GET TASKS ACCEPTED BY CURRENT USER
    // =========================================================

    @Override
    public List<TaskResponse> getAcceptedTasks() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        return taskRepository
                .findByAssignedTo(currentUser)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // SUBMIT WORK
    // =========================================================

    @Override
    public TaskResponse submitWork(
            String taskId,
            String completionMessage,
            MultipartFile proof
    ) throws IOException {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        if (task.getAssignedTo() == null ||
                !task.getAssignedTo()
                        .equals(currentUser)) {

            throw new UnauthorizedException(
                    "You are not assigned to this task"
            );
        }

        if (!"IN_PROGRESS".equals(
                task.getStatus()
        )) {

            throw new RuntimeException(
                    "Task is not in progress"
            );
        }

        if (proof != null &&
                !proof.isEmpty()) {

            String proofUrl =
                    fileStorageService.store(
                            proof,
                            "task-proofs"
                    );

            task.setProofUrl(
                    proofUrl
            );
        }

        task.setCompletionMessage(
                completionMessage
        );

        task.setSubmittedAt(
                LocalDateTime.now()
        );

        task.setStatus(
                "SUBMITTED"
        );

        Task updatedTask =
                taskRepository.save(task);

        notificationService.createNotification(
                task.getCreatedBy(),
                "SUBMITTED",
                "Work Submitted",
                currentUser +
                        " submitted work for \"" +
                        task.getTitle() +
                        "\".",
                task.getId()
        );

        return taskMapper.toResponse(
                updatedTask
        );
    }

    // =========================================================
    // APPROVE SUBMITTED WORK
    // =========================================================

    @Override
    public TaskResponse approveTask(
            String taskId
    ) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        if (!task.getCreatedBy()
                .equals(currentUser)) {

            throw new UnauthorizedException(
                    "Only the task creator can approve submitted work"
            );
        }

        if (!"SUBMITTED".equals(
                task.getStatus()
        )) {

            throw new RuntimeException(
                    "Task is not waiting for approval"
            );
        }

        task.setStatus(
                "COMPLETED"
        );

        Task updatedTask =
                taskRepository.save(task);

        if (task.getAssignedTo() != null) {

            notificationService.createNotification(
                    task.getAssignedTo(),
                    "APPROVED",
                    "Work Approved",
                    "Your work for \"" +
                            task.getTitle() +
                            "\" has been approved.",
                    task.getId()
            );
        }

        return taskMapper.toResponse(
                updatedTask
        );
    }

    // =========================================================
    // REJECT SUBMITTED WORK
    // =========================================================

    @Override
    public TaskResponse rejectTask(
            String taskId
    ) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        if (!task.getCreatedBy()
                .equals(currentUser)) {

            throw new UnauthorizedException(
                    "Only the task creator can reject submitted work"
            );
        }

        if (!"SUBMITTED".equals(
                task.getStatus()
        )) {

            throw new RuntimeException(
                    "Task is not waiting for approval"
            );
        }

        task.setStatus(
                "IN_PROGRESS"
        );

        Task updatedTask =
                taskRepository.save(task);

        if (task.getAssignedTo() != null) {

            notificationService.createNotification(
                    task.getAssignedTo(),
                    "REJECTED",
                    "Work Rejected",
                    "Your submitted work for \"" +
                            task.getTitle() +
                            "\" was rejected. " +
                            "Please update and resubmit it.",
                    task.getId()
            );
        }

        return taskMapper.toResponse(
                updatedTask
        );
    }

    // =========================================================
    // RATE COMPLETED TASK
    // =========================================================

    @Override
    public TaskResponse rateTask(
            String taskId,
            Integer rating,
            String review
    ) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        // Only task creator can rate the worker
        if (!task.getCreatedBy()
                .equals(currentUser)) {

            throw new UnauthorizedException(
                    "Only the task creator can rate this task"
            );
        }

        // Task must be completed first
        if (!"COMPLETED".equals(
                task.getStatus()
        )) {

            throw new RuntimeException(
                    "Task must be completed before rating"
            );
        }

        // Task must have an assigned worker
        if (task.getAssignedTo() == null ||
                task.getAssignedTo()
                        .isBlank()) {

            throw new RuntimeException(
                    "No worker is assigned to this task"
            );
        }

        // Rating must be between 1 and 5
        if (rating == null ||
                rating < 1 ||
                rating > 5) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );
        }

        // Prevent duplicate rating
        if (task.getRating() != null) {

            throw new RuntimeException(
                    "This task has already been rated"
            );
        }

        task.setRating(
                rating
        );

        if (review != null &&
                !review.isBlank()) {

            task.setReview(
                    review.trim()
            );

        } else {

            task.setReview(null);
        }

        task.setRatedAt(
                LocalDateTime.now()
        );

        Task updatedTask =
                taskRepository.save(task);

        // Notify worker
        notificationService.createNotification(
                task.getAssignedTo(),
                "RATED",
                "You Received a Rating",
                "You received " +
                        rating +
                        " star" +
                        (rating == 1 ? "" : "s") +
                        " for \"" +
                        task.getTitle() +
                        "\".",
                task.getId()
        );

        return taskMapper.toResponse(
                updatedTask
        );
    }

    // =========================================================
    // DELETE TASK
    // =========================================================

    @Override
    public void deleteTask(
            String id
    ) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new TaskNotFoundException(
                                "Task not found"
                        )
                );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        if (!task.getCreatedBy()
                .equals(currentUser)) {

            throw new UnauthorizedException(
                    "You are not authorized to delete this task"
            );
        }

        // =====================================================
        // DELETE ATTACHMENT FROM CLOUDINARY
        // =====================================================

        if (task.getAttachmentUrl() != null &&
                !task.getAttachmentUrl()
                        .isBlank()) {

            try {

                fileStorageService.delete(
                        task.getAttachmentUrl(),
                        "task-files"
                );

            } catch (Exception e) {

                System.err.println(
                        "Failed to delete task attachment from Cloudinary: "
                                + e.getMessage()
                );
            }
        }

        // =====================================================
        // DELETE PROOF FROM CLOUDINARY
        // =====================================================

        if (task.getProofUrl() != null &&
                !task.getProofUrl()
                        .isBlank()) {

            try {

                fileStorageService.delete(
                        task.getProofUrl(),
                        "task-proofs"
                );

            } catch (Exception e) {

                System.err.println(
                        "Failed to delete task proof from Cloudinary: "
                                + e.getMessage()
                );
            }
        }

        taskRepository.delete(
                task
        );
    }

    // =========================================================
    // GET MY CREATED TASKS
    // =========================================================

    @Override
    public List<TaskResponse> getMyTasks() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        return taskRepository
                .findByCreatedBy(currentUser)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // EXPLORE TASKS
    // =========================================================

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

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser =
                authentication.getName();

        Page<Task> taskPage =
                taskRepository.exploreTasks(
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

        return taskPage.map(
                taskMapper::toResponse
        );
    }
}