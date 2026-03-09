package com.abs.backend.config;

import com.abs.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/dashboard.html",
                                "/products.html",
                                "/cart.html",
                                "/orders.html",
                                "/admin.html",
                                "/common.js",
                                "/css/**",
                                "/js/**",
                                "/categories",
                                "/categories/**"
                        ).permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers("/api/products/**")
                        .hasAnyAuthority("ROLE_RETAIL", "ROLE_WHOLESALE", "ROLE_ADMIN")

                        .requestMatchers("/api/cart/**")
                        .hasAnyAuthority("ROLE_RETAIL", "ROLE_WHOLESALE")

                        .requestMatchers("/api/orders/**")
                        .hasAnyAuthority("ROLE_RETAIL", "ROLE_WHOLESALE")

                        .requestMatchers("/api/orders/**")
                        .hasAnyAuthority("ROLE_RETAIL", "ROLE_WHOLESALE")

                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")



                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/retail/**").hasAuthority("ROLE_RETAIL")
                        .requestMatchers("/api/wholesale/**").hasAuthority("ROLE_WHOLESALE")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}