package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.config.StorageConfig;
import com.campusmarketplace.server.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final StorageConfig storageConfig;

    @Override
    public String store(MultipartFile file, String folder) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        try {

            Path uploadPath = Paths.get(storageConfig.getUploadDir(), folder);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = Objects.requireNonNull(file.getOriginalFilename());

            String extension = "";

            int index = originalFileName.lastIndexOf(".");

            if (index > 0) {
                extension = originalFileName.substring(index);
            }

            String fileName = UUID.randomUUID() + extension;

            Path destination = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return folder + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Could not store file", e);
        }
    }

    @Override
    public Resource load(String filename, String folder) {

        try {

            Path path = Paths.get(storageConfig.getUploadDir(), folder)
                    .resolve(filename);

            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            throw new RuntimeException("File not found");

        } catch (MalformedURLException e) {
            throw new RuntimeException("File not found", e);
        }
    }
@Override
public void delete(String filename, String folder) {

    try {

        Path path = Paths.get(storageConfig.getUploadDir(), folder)
                .resolve(filename);

        Files.deleteIfExists(path);

    } catch (IOException e) {
        throw new RuntimeException("Could not delete file", e);
    }
}

@Override
public String getFileName(String filePath) {

    if (filePath == null || filePath.isBlank()) {
        return null;
    }

    return filePath.substring(filePath.lastIndexOf("/") + 1);
}
}