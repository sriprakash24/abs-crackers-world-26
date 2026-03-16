package com.abs.backend.controller;

import com.abs.backend.entity.Role;
import com.abs.backend.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/catalog")
@RequiredArgsConstructor
public class AdminCatalogController {

    private final CatalogService catalogService;


    @GetMapping("/data")
    public Map<String, List<Map<String, Object>>> getCatalogData(
            @RequestParam String type) {

        Role role = type.equalsIgnoreCase("wholesale")
                ? Role.ROLE_WHOLESALE
                : Role.ROLE_RETAIL;

        return catalogService.buildCatalog(role);
    }
}