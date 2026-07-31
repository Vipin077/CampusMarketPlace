package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.service.FileStorageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final Cloudinary cloudinary;

    @Override
    public String store(MultipartFile file, String folder) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String publicId = UUID.randomUUID().toString();

            Map<?, ?> uploadResult =
                    cloudinary.uploader().upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "folder",
                                    "campus-marketplace/" + folder,
                                    "public_id",
                                    publicId,
                                    "resource_type",
                                    "auto"
                            )
                    );

            Object secureUrl = uploadResult.get("secure_url");

            if (secureUrl == null) {
                throw new RuntimeException(
                        "Cloudinary did not return a secure URL"
                );
            }

            return secureUrl.toString();

        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not upload file to Cloudinary",
                    e
            );
        }
    }

    @Override
    public Resource load(String fileUrl, String folder) {

        if (fileUrl == null || fileUrl.isBlank()) {
            throw new RuntimeException("File URL is empty");
        }

        try {
            Resource resource =
                    new UrlResource(URI.create(fileUrl));

            if (resource.exists() && resource.isReadable()) {
                return resource;
            }

            throw new RuntimeException(
                    "Cloudinary file could not be read"
            );

        } catch (MalformedURLException |
                 IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid Cloudinary file URL",
                    e
            );
        }
    }

    @Override
    public void delete(String fileUrl, String folder) {

        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {
            String publicId =
                    extractPublicId(fileUrl, folder);

            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap(
                            "resource_type",
                            "auto"
                    )
            );

        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not delete file from Cloudinary",
                    e
            );
        }
    }

    @Override
    public String getFileName(String fileUrl) {

        if (fileUrl == null || fileUrl.isBlank()) {
            return null;
        }

        String fileName =
                fileUrl.substring(
                        fileUrl.lastIndexOf("/") + 1
                );

        int queryIndex = fileName.indexOf("?");

        if (queryIndex >= 0) {
            fileName =
                    fileName.substring(0, queryIndex);
        }

        return fileName;
    }

    private String extractPublicId(
            String fileUrl,
            String folder
    ) {

        String fileName = getFileName(fileUrl);

        if (fileName == null || fileName.isBlank()) {
            throw new RuntimeException(
                    "Invalid Cloudinary file URL"
            );
        }

        int extensionIndex =
                fileName.lastIndexOf(".");

        if (extensionIndex > 0) {
            fileName =
                    fileName.substring(
                            0,
                            extensionIndex
                    );
        }

        return "campus-marketplace/"
                + folder
                + "/"
                + fileName;
    }
}