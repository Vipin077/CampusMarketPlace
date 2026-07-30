package com.campusmarketplace.server.repository.custom;

import com.campusmarketplace.server.entity.Task;
import org.springframework.data.domain.Page;

public interface TaskCustomRepository {

    Page<Task> exploreTasks(
            String createdBy,
            String search,
            String category,
            Double minBudget,
            Double maxBudget,
            int page,
            int size,
            String sortBy,
            String direction
    );
}