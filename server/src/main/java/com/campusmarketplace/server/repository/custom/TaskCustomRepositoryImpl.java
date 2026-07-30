package com.campusmarketplace.server.repository.custom;

import com.campusmarketplace.server.entity.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TaskCustomRepositoryImpl implements TaskCustomRepository {

    private final MongoTemplate mongoTemplate;

   @Override
public Page<Task> exploreTasks(
        String createdBy,
        String search,
        String category,
        Double minBudget,
        Double maxBudget,
        int page,
        int size,
        String sortBy,
        String direction
) {

        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // Search by title, description and location
        if (search != null && !search.isBlank()) {
            String regex = ".*" + search.trim() + ".*";

            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("title").regex(regex, "i"),
                    Criteria.where("description").regex(regex, "i"),
                    Criteria.where("location").regex(regex, "i")
            ));
        }

        // Category filter
        if (category != null && !category.isBlank()) {
            criteriaList.add(Criteria.where("category").is(category));
        }

        // Minimum budget filter
        if (minBudget != null) {
            criteriaList.add(Criteria.where("budget").gte(minBudget));
        }

        // Maximum budget filter
        if (maxBudget != null) {
            criteriaList.add(Criteria.where("budget").lte(maxBudget));
        }

        // Combine all filters
        if (!criteriaList.isEmpty()) {
            query.addCriteria(
                    new Criteria().andOperator(criteriaList.toArray(new Criteria[0]))
            );
        }

        // Sorting
        Sort.Direction sortDirection =
                "desc".equalsIgnoreCase(direction)
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        String sortField =
                (sortBy == null || sortBy.isBlank())
                        ? "createdAt"
                        : sortBy;

        query.with(Sort.by(sortDirection, sortField));

        // Pagination
        query.skip((long) page * size);
        query.limit(size);

        // Total records
        long total = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                Task.class
        );

        // Fetch data
        List<Task> tasks = mongoTemplate.find(query, Task.class);

        return new PageImpl<>(
                tasks,
                PageRequest.of(page, size),
                total
        );
    }
}