package com.abs.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/retail")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Retail Access Granted";
    }
}