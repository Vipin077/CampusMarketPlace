package com.campusmarketplace.server.controller;

import com.campusmarketplace.server.dto.request.CreateTaskRequest;
import com.campusmarketplace.server.dto.response.TaskResponse;
import com.campusmarketplace.server.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // =========================================================
    // CREATE TASK
    // =========================================================

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TaskResponse> createTask(

            @Valid
            @RequestPart("task")
            CreateTaskRequest request,

            @RequestPart(value = "attachment", required = false)
            MultipartFile attachment
    ) {

        return new ResponseEntity<>(
                taskService.createTask(request, attachment),
                HttpStatus.CREATED
        );
    }

    // =========================================================
    // GET ALL TASKS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {

        return ResponseEntity.ok(
                taskService.getAllTasks()
        );
    }

    // =========================================================
    // GET TASK BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                taskService.getTaskById(id)
        );
    }

    // =========================================================
    // DOWNLOAD ORIGINAL TASK ATTACHMENT
    // =========================================================

    @GetMapping(
            value = "/{id}/attachment",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable String id
    ) {

        Resource resource = taskService.downloadAttachment(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                resource.getFilename() + "\""
                )
                .body(resource);
    }

    // =========================================================
    // DOWNLOAD SUBMITTED PROOF
    // =========================================================

    @GetMapping(
            value = "/{id}/proof",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public ResponseEntity<Resource> downloadProof(
            @PathVariable String id
    ) {

        Resource resource = taskService.downloadProof(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                resource.getFilename() + "\""
                )
                .body(resource);
    }

    // =========================================================
    // UPDATE TASK
    // =========================================================

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TaskResponse> updateTask(

            @PathVariable String id,

            @RequestPart("task")
            String taskJson,

            @RequestPart(value = "attachment", required = false)
            MultipartFile attachment

    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        CreateTaskRequest request =
                mapper.readValue(
                        taskJson,
                        CreateTaskRequest.class
                );

        return ResponseEntity.ok(
                taskService.updateTask(
                        id,
                        request,
                        attachment
                )
        );
    }

    // =========================================================
    // ACCEPT TASK
    // =========================================================

    @PostMapping("/{id}/accept")
    public ResponseEntity<TaskResponse> acceptTask(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                taskService.acceptTask(id)
        );
    }

    // =========================================================
    // GET TASKS ACCEPTED BY CURRENT USER
    // =========================================================

    @GetMapping("/accepted")
    public ResponseEntity<List<TaskResponse>> getAcceptedTasks() {

        return ResponseEntity.ok(
                taskService.getAcceptedTasks()
        );
    }

    // =========================================================
    // SUBMIT COMPLETED WORK
    // =========================================================

    @PostMapping(
            value = "/{id}/submit-work",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TaskResponse> submitWork(

            @PathVariable String id,

            @RequestPart("completionMessage")
            String completionMessage,

            @RequestPart(value = "proof", required = false)
            MultipartFile proof

    ) throws IOException {

        return ResponseEntity.ok(
                taskService.submitWork(
                        id,
                        completionMessage,
                        proof
                )
        );
    }

    // =========================================================
    // APPROVE SUBMITTED WORK
    // =========================================================

    @PostMapping("/{id}/approve")
    public ResponseEntity<TaskResponse> approveTask(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                taskService.approveTask(id)
        );
    }

    // =========================================================
    // REJECT SUBMITTED WORK
    // =========================================================

    @PostMapping("/{id}/reject")
    public ResponseEntity<TaskResponse> rejectTask(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                taskService.rejectTask(id)
        );
    }

    // =========================================================
    // DELETE TASK
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable String id
    ) {

        taskService.deleteTask(id);

        return ResponseEntity.ok(
                "Task deleted successfully"
        );
    }

    // =========================================================
    // GET MY CREATED TASKS
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<List<TaskResponse>> getMyTasks() {

        return ResponseEntity.ok(
                taskService.getMyTasks()
        );
    }

    // =========================================================
    // EXPLORE TASKS
    // =========================================================

    @GetMapping("/explore")
    public ResponseEntity<Page<TaskResponse>> exploreTasks(

            @RequestParam(defaultValue = "")
            String search,

            @RequestParam(defaultValue = "")
            String category,

            @RequestParam(required = false)
            Double minBudget,

            @RequestParam(required = false)
            Double maxBudget,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction
    ) {

        return ResponseEntity.ok(
                taskService.exploreTasks(
                        search,
                        category,
                        minBudget,
                        maxBudget,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }
}