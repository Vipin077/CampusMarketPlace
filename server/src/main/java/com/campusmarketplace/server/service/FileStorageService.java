package com.campusmarketplace.server.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String store(MultipartFile file, String folder);

    Resource load(String fileUrl, String folder);

    void delete(String fileUrl, String folder);

    String getFileName(String fileUrl);
}