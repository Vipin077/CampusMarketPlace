package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.response.UserResponse;

public interface UserService {

    UserResponse getUserById(String id);

    UserResponse getUserByEmail(String email);
}