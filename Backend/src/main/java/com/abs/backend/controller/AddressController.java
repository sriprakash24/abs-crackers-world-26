package com.abs.backend.controller;

import com.abs.backend.dto.AddressRequest;
import com.abs.backend.entity.Address;
import com.abs.backend.entity.User;
import com.abs.backend.repository.UserRepository;
import com.abs.backend.security.JwtUtil;
import com.abs.backend.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @GetMapping
    public List<Address> getAddresses(HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);

        Long userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressService.getUserAddresses(user);
    }

    @PostMapping
    public Address addAddress(
            HttpServletRequest request,
            @RequestBody AddressRequest body) {

        String token = request.getHeader("Authorization").substring(7);

        Long userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressService.addAddress(user, body);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable Long id) {

        addressService.deleteAddress(id);
    }

    @PutMapping("/{id}")
    public Address updateAddress(
            @PathVariable Long id,
            @RequestBody AddressRequest body) {

        return addressService.updateAddress(id, body);
    }


}