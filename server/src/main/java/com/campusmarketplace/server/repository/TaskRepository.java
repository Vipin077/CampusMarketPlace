package com.campusmarketplace.server.repository;

import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.repository.custom.TaskCustomRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String>,
        TaskCustomRepository {

    List<Task> findByCreatedBy(String createdBy);

    List<Task> findByCreatedByNot(String createdBy);

    long countByCreatedBy(String createdBy);

    long countByCreatedByAndStatus(String createdBy, String status);

    List<Task> findTop5ByCreatedByOrderByCreatedAtDesc(String createdBy);
}