package com.campusmarketplace.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfig {

    @Value("${storage.upload-dir}")
    private String uploadDir;

    public String getUploadDir() {
        return uploadDir;
    }
}