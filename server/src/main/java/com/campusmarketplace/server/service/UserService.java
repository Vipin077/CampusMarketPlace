package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.request.UpdateProfileRequest;
import com.campusmarketplace.server.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserResponse getUserById(String id);

    UserResponse getUserByEmail(String email);

    UserResponse updateProfile(
            UpdateProfileRequest request,
            MultipartFile profilePicture
    );
}