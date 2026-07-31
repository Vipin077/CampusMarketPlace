package com.campusmarketplace.server.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    private String fullName;

    private String bio;

    private String department;

    private String year;
}