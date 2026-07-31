package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.response.UserResponse;
import com.campusmarketplace.server.entity.User;
import com.campusmarketplace.server.mapper.UserMapper;
import com.campusmarketplace.server.repository.UserRepository;
import com.campusmarketplace.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    @Override
    public UserResponse getUserById(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toResponse(user);
    }
}