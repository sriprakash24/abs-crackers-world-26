package com.abs.backend.security;

import com.abs.backend.entity.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key =
            Keys.hmacShaKeyFor("abs-super-secret-key-abs-super-secret-key".getBytes());
    private final long EXPIRATION = 1000 * 60 * 60; // 1 hour

    public String generateToken(Long userId, String phone, Role role) {

        return Jwts.builder()
                .subject(phone)
                .claim("userId", userId)
                .claim("role", role.name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}