package com.campusmarketplace.server.service;

import com.campusmarketplace.server.entity.TaskRequest;

import java.util.List;

public interface TaskRequestService {

    /**
     * User requests a task.
     */
    TaskRequest requestTask(
            String taskId,
            String message
    );

    /**
     * Owner approves a request.
     */
    TaskRequest approveRequest(
            String requestId
    );

    /**
     * Owner rejects a request.
     */
    TaskRequest rejectRequest(
            String requestId
    );

    /**
     * All requests for a task.
     */
    List<TaskRequest> getTaskRequests(
            String taskId
    );

    /**
     * Requests made by current user.
     */
    List<TaskRequest> getMyRequests();

    /**
     * Pending requests received by current user.
     */
    List<TaskRequest> getPendingRequests();
}