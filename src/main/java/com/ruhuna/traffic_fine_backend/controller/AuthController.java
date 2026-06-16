package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.dto.LoginRequest;
import com.ruhuna.traffic_fine_backend.dto.LoginResponse;
import com.ruhuna.traffic_fine_backend.dto.RegisterRequest;
import com.ruhuna.traffic_fine_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Authenticates the user and returns a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Invalid username or password."));
        } catch (DisabledException e) {
            return ResponseEntity
                    .status(403)
                    .body(Map.of("message", "Account is disabled. Please contact the administrator."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("message", "Login failed. Please try again."));
        }
    }

    /**
     * POST /api/auth/register
     * Creates a new user account with the OFFICER role.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity
                    .status(201)
                    .body(Map.of("message", "Account created successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(409)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("message", "Registration failed. Please try again."));
        }
    }
}
