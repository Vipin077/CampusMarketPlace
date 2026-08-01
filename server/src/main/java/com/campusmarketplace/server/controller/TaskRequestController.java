package com.campusmarketplace.server.controller;

import com.campusmarketplace.server.entity.TaskRequest;
import com.campusmarketplace.server.service.TaskRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-requests")
@RequiredArgsConstructor
public class TaskRequestController {

    private final TaskRequestService taskRequestService;

    // =========================================================
    // REQUEST A TASK
    // =========================================================

    @PostMapping("/{taskId}")
    public ResponseEntity<TaskRequest> requestTask(
            @PathVariable String taskId,
            @RequestParam(required = false) String message
    ) {

        return ResponseEntity.ok(
                taskRequestService.requestTask(
                        taskId,
                        message
                )
        );
    }

    // =========================================================
    // OWNER APPROVES REQUEST
    // =========================================================

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<TaskRequest> approveRequest(
            @PathVariable String requestId
    ) {

        return ResponseEntity.ok(
                taskRequestService.approveRequest(requestId)
        );
    }

    // =========================================================
    // OWNER REJECTS REQUEST
    // =========================================================

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<TaskRequest> rejectRequest(
            @PathVariable String requestId
    ) {

        return ResponseEntity.ok(
                taskRequestService.rejectRequest(requestId)
        );
    }

    // =========================================================
    // GET ALL REQUESTS FOR A TASK
    // =========================================================

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskRequest>> getTaskRequests(
            @PathVariable String taskId
    ) {

        return ResponseEntity.ok(
                taskRequestService.getTaskRequests(taskId)
        );
    }

    // =========================================================
    // MY REQUESTS
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<List<TaskRequest>> getMyRequests() {

        return ResponseEntity.ok(
                taskRequestService.getMyRequests()
        );
    }

    // =========================================================
    // OWNER PENDING REQUESTS
    // =========================================================

    @GetMapping("/pending")
    public ResponseEntity<List<TaskRequest>> getPendingRequests() {

        return ResponseEntity.ok(
                taskRequestService.getPendingRequests()
        );
    }
}