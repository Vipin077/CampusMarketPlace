package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.entity.TaskRequest;
import com.campusmarketplace.server.entity.enums.RequestStatus;
import com.campusmarketplace.server.entity.enums.TaskStatus;
import com.campusmarketplace.server.exception.TaskNotFoundException;
import com.campusmarketplace.server.exception.UnauthorizedException;
import com.campusmarketplace.server.repository.TaskRepository;
import com.campusmarketplace.server.repository.TaskRequestRepository;
import com.campusmarketplace.server.service.NotificationService;
import com.campusmarketplace.server.service.TaskRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskRequestServiceImpl implements TaskRequestService {

    private final TaskRepository taskRepository;
    private final TaskRequestRepository taskRequestRepository;
    private final NotificationService notificationService;

    @Override
    public TaskRequest requestTask(
            String taskId,
            String message
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String currentUser = authentication.getName();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new TaskNotFoundException("Task not found")
                );

        // Owner cannot request own task
        if (task.getCreatedBy().equals(currentUser)) {
            throw new UnauthorizedException(
                    "You cannot request your own task."
            );
        }

        // Only OPEN tasks can be requested
        if (task.getStatus() != TaskStatus.OPEN) {
            throw new RuntimeException(
                    "Task is not available."
            );
        }

        // Prevent duplicate request
        if (taskRequestRepository
                .findByTaskIdAndRequesterId(taskId, currentUser)
                .isPresent()) {

            throw new RuntimeException(
                    "You have already requested this task."
            );
        }

        TaskRequest taskRequest =
                TaskRequest.builder()
                        .taskId(task.getId())
                        .ownerId(task.getCreatedBy())
                        .requesterId(currentUser)
                        .message(message)
                        .status(RequestStatus.PENDING)
                        .requestedAt(LocalDateTime.now())
                        .build();

        TaskRequest saved =
                taskRequestRepository.save(taskRequest);

        notificationService.createNotification(
                task.getCreatedBy(),
                "TASK_REQUEST",
                "New Task Request",
                currentUser + " requested your task \"" +
                        task.getTitle() + "\".",
                task.getId()
        );

        return saved;
    }

@Override
public TaskRequest approveRequest(String requestId) {

    Authentication authentication =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication();

    String currentUser = authentication.getName();

    // =====================================================
    // GET REQUEST
    // =====================================================

    TaskRequest request = taskRequestRepository
            .findById(requestId)
            .orElseThrow(() ->
                    new RuntimeException("Request not found")
            );

    // =====================================================
    // ONLY OWNER CAN APPROVE
    // =====================================================

    if (!request.getOwnerId().equals(currentUser)) {

        throw new UnauthorizedException(
                "Only task owner can approve requests."
        );
    }

    // =====================================================
    // REQUEST MUST BE PENDING
    // =====================================================

    if (request.getStatus() != RequestStatus.PENDING) {

        throw new RuntimeException(
                "Request already processed."
        );
    }

    // =====================================================
    // GET TASK
    // =====================================================

    Task task = taskRepository
            .findById(request.getTaskId())
            .orElseThrow(() ->
                    new TaskNotFoundException("Task not found")
            );

    // =====================================================
    // TASK MUST BE OPEN
    // =====================================================

    if (task.getStatus() != TaskStatus.OPEN) {

        throw new RuntimeException(
                "Task is no longer available."
        );
    }

    // =====================================================
    // ASSIGN USER
    // =====================================================

    task.setAssignedTo(
            request.getRequesterId()
    );

    task.setApprovedAt(
            LocalDateTime.now()
    );

    task.setStatus(
            TaskStatus.IN_PROGRESS
    );

    taskRepository.save(task);

    // =====================================================
    // APPROVE REQUEST
    // =====================================================

    request.setStatus(
            RequestStatus.APPROVED
    );

    request.setRespondedAt(
            LocalDateTime.now()
    );

    taskRequestRepository.save(request);

    // =====================================================
    // REJECT ALL OTHER REQUESTS
    // =====================================================

    List<TaskRequest> requests =
            taskRequestRepository.findByTaskIdAndStatus(
                    task.getId(),
                    RequestStatus.PENDING
            );

    for (TaskRequest r : requests) {

        if (!r.getId().equals(requestId)) {

            r.setStatus(
                    RequestStatus.REJECTED
            );

            r.setRespondedAt(
                    LocalDateTime.now()
            );

            taskRequestRepository.save(r);

            notificationService.createNotification(
                    r.getRequesterId(),
                    "REQUEST_REJECTED",
                    "Task Request Rejected",
                    "Your request for \"" +
                            task.getTitle() +
                            "\" was not selected.",
                    task.getId()
            );
        }
    }

    // =====================================================
    // NOTIFY APPROVED USER
    // =====================================================

    notificationService.createNotification(
            request.getRequesterId(),
            "REQUEST_APPROVED",
            "Task Request Approved",
            "Your request for \"" +
                    task.getTitle() +
                    "\" has been approved.",
            task.getId()
    );

    return request;
}
@Override
public TaskRequest rejectRequest(String requestId) {

    Authentication authentication =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication();

    String currentUser = authentication.getName();

    // =====================================================
    // GET REQUEST
    // =====================================================

    TaskRequest request = taskRequestRepository
            .findById(requestId)
            .orElseThrow(() ->
                    new RuntimeException("Request not found")
            );

    // =====================================================
    // ONLY OWNER CAN REJECT
    // =====================================================

    if (!request.getOwnerId().equals(currentUser)) {

        throw new UnauthorizedException(
                "Only task owner can reject requests."
        );
    }

    // =====================================================
    // REQUEST MUST BE PENDING
    // =====================================================

    if (request.getStatus() != RequestStatus.PENDING) {

        throw new RuntimeException(
                "Request already processed."
        );
    }

    // =====================================================
    // REJECT REQUEST
    // =====================================================

    request.setStatus(RequestStatus.REJECTED);
    request.setRespondedAt(LocalDateTime.now());

    TaskRequest saved =
            taskRequestRepository.save(request);

    // =====================================================
    // GET TASK
    // =====================================================

    Task task = taskRepository
            .findById(request.getTaskId())
            .orElseThrow(() ->
                    new TaskNotFoundException("Task not found")
            );

    // =====================================================
    // NOTIFY REQUESTER
    // =====================================================

    notificationService.createNotification(
            request.getRequesterId(),
            "REQUEST_REJECTED",
            "Task Request Rejected",
            "Your request for \"" +
                    task.getTitle() +
                    "\" has been rejected.",
            task.getId()
    );

    return saved;
}

    @Override
    public List<TaskRequest> getTaskRequests(
            String taskId
    ) {
        return taskRequestRepository.findByTaskId(taskId);
    }

    @Override
    public List<TaskRequest> getMyRequests() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return taskRequestRepository.findByRequesterId(
                authentication.getName()
        );
    }

    @Override
    public List<TaskRequest> getPendingRequests() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return taskRequestRepository.findByOwnerIdAndStatus(
                authentication.getName(),
                RequestStatus.PENDING
        );
    }
}