package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.request.UpdateProfileRequest;
import com.campusmarketplace.server.dto.response.UserResponse;
import com.campusmarketplace.server.entity.Task;
import com.campusmarketplace.server.entity.User;
import com.campusmarketplace.server.mapper.UserMapper;
import com.campusmarketplace.server.repository.TaskRepository;
import com.campusmarketplace.server.repository.UserRepository;
import com.campusmarketplace.server.service.FileStorageService;
import com.campusmarketplace.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final FileStorageService fileStorageService;

    private final TaskRepository taskRepository;

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @Override
    public UserResponse getUserById(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        return getUserResponseWithStats(user);
    }

    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    @Override
    public UserResponse getUserByEmail(
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        return getUserResponseWithStats(user);
    }

    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    @Override
    public UserResponse updateProfile(
            UpdateProfileRequest request,
            MultipartFile profilePicture
    ) {

        String currentUserEmail =
                getCurrentUserEmail();

        User user = userRepository
                .findByEmail(currentUserEmail)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        // =====================================================
        // UPDATE FULL NAME
        // =====================================================

        if (request.getFullName() != null &&
                !request.getFullName().isBlank()) {

            user.setFullName(
                    request.getFullName().trim()
            );
        }

        // =====================================================
        // UPDATE BIO
        // =====================================================

        if (request.getBio() != null) {

            user.setBio(
                    request.getBio().trim()
            );
        }

        // =====================================================
        // UPDATE DEPARTMENT
        // =====================================================

        if (request.getDepartment() != null) {

            user.setDepartment(
                    request.getDepartment().trim()
            );
        }

        // =====================================================
        // UPDATE YEAR
        // =====================================================

        if (request.getYear() != null) {

            user.setYear(
                    request.getYear().trim()
            );
        }

        // =====================================================
        // UPDATE PROFILE PICTURE
        // =====================================================

        if (profilePicture != null &&
                !profilePicture.isEmpty()) {

            String oldProfilePicture =
                    user.getProfilePicture();

            String newProfilePicture =
                    fileStorageService.store(
                            profilePicture,
                            "profile-pictures"
                    );

            user.setProfilePicture(
                    newProfilePicture
            );

            if (oldProfilePicture != null &&
                    !oldProfilePicture.isBlank()) {

                try {

                    fileStorageService.delete(
                            oldProfilePicture,
                            "profile-pictures"
                    );

                } catch (Exception e) {

                    System.err.println(
                            "Could not delete old profile picture: "
                                    + e.getMessage()
                    );
                }
            }
        }

        // =====================================================
        // SAVE UPDATED USER
        // =====================================================

        User updatedUser =
                userRepository.save(user);

        return getUserResponseWithStats(
                updatedUser
        );
    }

    // =========================================================
    // CALCULATE PROFILE STATS
    // =========================================================

    private UserResponse getUserResponseWithStats(
            User user
    ) {

        String email = user.getEmail();

        // =====================================================
        // ACTIVE TASKS
        //
        // IN_PROGRESS = currently working
        // SUBMITTED   = submitted and waiting for approval
        // =====================================================

        long inProgressTasks =
                taskRepository
                        .countByAssignedToAndStatus(
                                email,
                                "IN_PROGRESS"
                        );

        long submittedTasks =
                taskRepository
                        .countByAssignedToAndStatus(
                                email,
                                "SUBMITTED"
                        );

        long activeTasks =
                inProgressTasks
                        + submittedTasks;

        // =====================================================
        // COMPLETED TASKS
        // =====================================================

        long completedTasks =
                taskRepository
                        .countByAssignedToAndStatus(
                                email,
                                "COMPLETED"
                        );

        // =====================================================
        // RATING
        // =====================================================

        List<Task> ratedTasks =
                taskRepository
                        .findByAssignedToAndStatusAndRatingIsNotNull(
                                email,
                                "COMPLETED"
                        );

        double averageRating = 0.0;

        if (!ratedTasks.isEmpty()) {

            averageRating =
                    ratedTasks.stream()
                            .map(Task::getRating)
                            .mapToInt(Integer::intValue)
                            .average()
                            .orElse(0.0);

            // Round to one decimal place
            // Example: 4.666 -> 4.7
            averageRating =
                    Math.round(
                            averageRating * 10.0
                    ) / 10.0;
        }

        // =====================================================
        // SET CALCULATED VALUES
        // =====================================================

        user.setActiveTasks(
                (int) activeTasks
        );

        user.setCompletedTasks(
                (int) completedTasks
        );

        user.setRating(
                averageRating
        );

        return userMapper.toResponse(
                user
        );
    }

    // =========================================================
    // CURRENT AUTHENTICATED USER
    // =========================================================

    private String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        return authentication.getName();
    }
}