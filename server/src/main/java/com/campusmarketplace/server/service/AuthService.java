package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.request.LoginRequest;
import com.campusmarketplace.server.dto.request.RegisterRequest;
import com.campusmarketplace.server.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
