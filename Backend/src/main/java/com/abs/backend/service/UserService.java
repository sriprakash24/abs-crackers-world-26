package com.abs.backend.service;

import com.abs.backend.dto.ProfileResponse;
import com.abs.backend.dto.ProfileUpdateRequest;
import com.abs.backend.dto.RegisterRequest;
import com.abs.backend.entity.User;
import com.abs.backend.exception.*;
import com.abs.backend.repository.UserRepository;
import com.abs.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest request) {

//        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//            throw new EmailAlreadyExistsException();
//        }
        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new ValidationException("Phone number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public String login(String phone, String password) {

        User user = userRepository.findByPhone(phone)
                .orElseThrow(UserNotFoundException::new);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return jwtUtil.generateToken(user.getId(), user.getPhone(), user.getRole());
    }

    public User getByPhone(String phone) {
        return userRepository.findByPhone(phone)
                .orElseThrow(UserNotFoundException::new);
    }

    public void resetPassword(String phone, String newPassword) {

        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new ValidationException("User not found with this phone number"));

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    public ProfileResponse getProfile(String phone) {

        User user = getByPhone(phone);

        ProfileResponse response = new ProfileResponse();
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setEmail(user.getEmail());

        return response;
    }

    public ProfileResponse updateProfile(String phone, ProfileUpdateRequest request) {

        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        userRepository.save(user);

        ProfileResponse response = new ProfileResponse();
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setEmail(user.getEmail());

        return response;
    }
}