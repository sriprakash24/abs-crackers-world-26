package com.abs.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "C:/abs-uploads/payment-screenshots/";

    public String storeFile(MultipartFile file) {

        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs(); // create folder if not exists
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath = Paths.get(uploadDir + fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName; // store only filename in DB

        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }
}