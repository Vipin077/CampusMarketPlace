package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.response.DashboardResponse;
import com.campusmarketplace.server.dto.response.TaskResponse;
import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.mapper.TaskMapper;
import com.campusmarketplace.server.repository.TaskRepository;
import com.campusmarketplace.server.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Override
    public DashboardResponse getDashboard() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String currentUser = authentication.getName();

        long myTasks = taskRepository.countByCreatedBy(currentUser);
        long openTasks = taskRepository.countByCreatedByAndStatus(currentUser, "OPEN");
        long completedTasks = taskRepository.countByCreatedByAndStatus(currentUser, "COMPLETED");

        List<TaskResponse> recentTasks = taskRepository
                .findTop5ByCreatedByOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(taskMapper::toResponse)
                .toList();

        return DashboardResponse.builder()
                .myTasks(myTasks)
                .openTasks(openTasks)
                .completedTasks(completedTasks)
                .recentTasks(recentTasks)
                .build();
    }
}
