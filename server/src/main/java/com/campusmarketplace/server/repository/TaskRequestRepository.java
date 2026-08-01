package com.campusmarketplace.server.repository;

import com.campusmarketplace.server.entity.TaskRequest;
import com.campusmarketplace.server.entity.enums.RequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRequestRepository extends MongoRepository<TaskRequest, String> {

    List<TaskRequest> findByTaskId(String taskId);

    List<TaskRequest> findByRequesterId(String requesterId);

    List<TaskRequest> findByOwnerId(String ownerId);

    Optional<TaskRequest> findByTaskIdAndRequesterId(
            String taskId,
            String requesterId
    );

    List<TaskRequest> findByTaskIdAndStatus(
            String taskId,
            RequestStatus status
    );

    List<TaskRequest> findByOwnerIdAndStatus(
            String ownerId,
            RequestStatus status
    );
}