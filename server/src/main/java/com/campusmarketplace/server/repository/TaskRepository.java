package com.campusmarketplace.server.repository;

import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.repository.custom.TaskCustomRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository
        extends MongoRepository<Task, String>,
        TaskCustomRepository {

    // =========================================================
    // BASIC TASK QUERIES
    // =========================================================

    List<Task> findByCreatedBy(
            String createdBy
    );

    List<Task> findByAssignedTo(
            String assignedTo
    );

    List<Task> findByCreatedByNot(
            String createdBy
    );

    // =========================================================
    // CREATED TASK COUNTS
    // =========================================================

    long countByCreatedBy(
            String createdBy
    );

    long countByCreatedByAndStatus(
            String createdBy,
            String status
    );

    // =========================================================
    // PROFILE STATS
    // =========================================================

    long countByAssignedToAndStatus(
            String assignedTo,
            String status
    );

    // =========================================================
    // RATING
    // =========================================================

    List<Task> findByAssignedToAndStatusAndRatingIsNotNull(
            String assignedTo,
            String status
    );

    // =========================================================
    // RECENT TASKS
    // =========================================================

    List<Task> findTop5ByCreatedByOrderByCreatedAtDesc(
            String createdBy
    );
}