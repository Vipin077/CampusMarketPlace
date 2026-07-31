package com.campusmarketplace.server.controller;

import com.campusmarketplace.server.dto.request.UpdateProfileRequest;
import com.campusmarketplace.server.dto.response.UserResponse;
import com.campusmarketplace.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(
            @PathVariable String email
    ) {

        return ResponseEntity.ok(
                userService.getUserByEmail(email)
        );
    }

    // =========================================================
    // UPDATE CURRENT USER PROFILE
    // =========================================================

    @PutMapping(
            value = "/profile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserResponse> updateProfile(

            @RequestPart("data")
            UpdateProfileRequest request,

            @RequestPart(
                    value = "profilePicture",
                    required = false
            )
            MultipartFile profilePicture
    ) {

        return ResponseEntity.ok(
                userService.updateProfile(
                        request,
                        profilePicture
                )
        );
    }
}