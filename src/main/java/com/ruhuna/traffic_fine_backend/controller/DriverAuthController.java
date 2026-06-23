package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.dto.DriverAuthResponse;
import com.ruhuna.traffic_fine_backend.dto.DriverLoginRequest;
import com.ruhuna.traffic_fine_backend.dto.DriverSignupRequest;
import com.ruhuna.traffic_fine_backend.service.DriverAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/driver-auth")
@CrossOrigin(origins = "*")
public class DriverAuthController {

    private final DriverAuthService driverAuthService;

    public DriverAuthController(DriverAuthService driverAuthService) {
        this.driverAuthService = driverAuthService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody DriverSignupRequest request) {
        try {
            DriverAuthResponse response = driverAuthService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DriverLoginRequest request) {
        try {
            DriverAuthResponse response = driverAuthService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
