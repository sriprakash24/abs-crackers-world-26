package com.abs.backend.controller;

import com.abs.backend.dto.LoginRequest;
import com.abs.backend.dto.RegisterRequest;
import com.abs.backend.dto.ResetPasswordRequest;
import com.abs.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return userService.login(request.getPhone(), request.getPassword());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request.getPhone(), request.getNewPassword());

        return ResponseEntity.ok("Password updated successfully");
    }
}