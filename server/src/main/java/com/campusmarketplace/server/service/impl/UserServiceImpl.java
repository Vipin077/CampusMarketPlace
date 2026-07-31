package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.request.UpdateProfileRequest;
import com.campusmarketplace.server.dto.response.UserResponse;
import com.campusmarketplace.server.entity.User;
import com.campusmarketplace.server.mapper.UserMapper;
import com.campusmarketplace.server.repository.UserRepository;
import com.campusmarketplace.server.service.FileStorageService;
import com.campusmarketplace.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final FileStorageService fileStorageService;

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

        return userMapper.toResponse(user);
    }

    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    @Override
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        return userMapper.toResponse(user);
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

        User user =
                userRepository
                        .findByEmail(currentUserEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        // =====================================================
        // UPDATE BASIC PROFILE DETAILS
        // =====================================================

        if (request.getFullName() != null &&
                !request.getFullName().isBlank()) {

            user.setFullName(
                    request.getFullName().trim()
            );
        }

        if (request.getBio() != null) {
            user.setBio(
                    request.getBio().trim()
            );
        }

        if (request.getDepartment() != null) {
            user.setDepartment(
                    request.getDepartment().trim()
            );
        }

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

            // Delete previous Cloudinary image
            if (oldProfilePicture != null &&
                    !oldProfilePicture.isBlank()) {

                try {
                    fileStorageService.delete(
                            oldProfilePicture,
                            "profile-pictures"
                    );
                } catch (Exception e) {

                    // Profile update should not fail
                    // only because old image deletion failed
                    System.err.println(
                            "Could not delete old profile picture: "
                                    + e.getMessage()
                    );
                }
            }
        }

        // =====================================================
        // SAVE
        // =====================================================

        User updatedUser =
                userRepository.save(user);

        return userMapper.toResponse(
                updatedUser
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