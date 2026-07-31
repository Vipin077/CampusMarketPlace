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
import java.util.regex.Pattern;

@Repository
@RequiredArgsConstructor
public class TaskCustomRepositoryImpl
        implements TaskCustomRepository {

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

        // =====================================================
        // EXCLUDE CURRENT USER'S OWN TASKS
        // =====================================================

        if (createdBy != null && !createdBy.isBlank()) {
            criteriaList.add(
                    Criteria.where("createdBy").ne(createdBy)
            );
        }

        // =====================================================
        // SEARCH
        // =====================================================

        if (search != null && !search.isBlank()) {

            String safeSearch =
                    Pattern.quote(search.trim());

            criteriaList.add(
                    new Criteria().orOperator(

                            Criteria.where("title")
                                    .regex(safeSearch, "i"),

                            Criteria.where("description")
                                    .regex(safeSearch, "i"),

                            Criteria.where("location")
                                    .regex(safeSearch, "i"),

                            Criteria.where("category")
                                    .regex(safeSearch, "i")
                    )
            );
        }

        // =====================================================
        // CATEGORY FILTER
        // =====================================================

        if (category != null && !category.isBlank()) {

            criteriaList.add(
                    Criteria.where("category")
                            .regex(
                                    "^" +
                                            Pattern.quote(
                                                    category.trim()
                                            ) +
                                            "$",
                                    "i"
                            )
            );
        }

        // =====================================================
        // MINIMUM BUDGET
        // =====================================================

        if (minBudget != null) {
            criteriaList.add(
                    Criteria.where("budget")
                            .gte(minBudget)
            );
        }

        // =====================================================
        // MAXIMUM BUDGET
        // =====================================================

        if (maxBudget != null) {
            criteriaList.add(
                    Criteria.where("budget")
                            .lte(maxBudget)
            );
        }

        // =====================================================
        // COMBINE FILTERS
        // =====================================================

        if (!criteriaList.isEmpty()) {

            query.addCriteria(
                    new Criteria().andOperator(
                            criteriaList.toArray(
                                    new Criteria[0]
                            )
                    )
            );
        }

        // =====================================================
        // SORTING
        // =====================================================

        Sort.Direction sortDirection =
                "asc".equalsIgnoreCase(direction)
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        String sortField =
                sortBy == null || sortBy.isBlank()
                        ? "createdAt"
                        : sortBy;

        query.with(
                Sort.by(
                        sortDirection,
                        sortField
                )
        );

        // =====================================================
        // TOTAL COUNT BEFORE PAGINATION
        // =====================================================

        long total =
                mongoTemplate.count(
                        Query.of(query)
                                .limit(-1)
                                .skip(-1),
                        Task.class
                );

        // =====================================================
        // PAGINATION
        // =====================================================

        query.skip((long) page * size);
        query.limit(size);

        // =====================================================
        // FETCH TASKS
        // =====================================================

        List<Task> tasks =
                mongoTemplate.find(
                        query,
                        Task.class
                );

        // =====================================================
        // RETURN PAGE
        // =====================================================

        return new PageImpl<>(
                tasks,
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                sortDirection,
                                sortField
                        )
                ),
                total
        );
    }
}