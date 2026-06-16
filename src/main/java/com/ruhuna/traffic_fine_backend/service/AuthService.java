package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.Role;
import com.ruhuna.traffic_fine_backend.Entity.SystemUser;
import com.ruhuna.traffic_fine_backend.dto.LoginRequest;
import com.ruhuna.traffic_fine_backend.dto.LoginResponse;
import com.ruhuna.traffic_fine_backend.dto.RegisterRequest;
import com.ruhuna.traffic_fine_backend.repository.SystemUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final SystemUserRepository systemUserRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            SystemUserRepository systemUserRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.systemUserRepository = systemUserRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates the user with the given credentials and returns a JWT token.
     *
     * @param request login request containing username and password
     * @return LoginResponse with token, token type, username, and role
     */
    public LoginResponse login(LoginRequest request) {
        // Authenticate — throws BadCredentialsException on failure
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Load user details for JWT generation
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        // Fetch the SystemUser entity to get the role
        SystemUser systemUser = systemUserRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        String role = systemUser.getRole().name();

        // Generate JWT token
        String token = jwtService.generateToken(userDetails, role);

        return new LoginResponse(token, "Bearer", request.getUsername(), role);
    }

    /**
     * Registers a new user account with the OFFICER role.
     *
     * @param request register request containing username and password
     * @throws IllegalArgumentException if the username is already taken
     */
    public void register(RegisterRequest request) {
        if (systemUserRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        SystemUser newUser = new SystemUser(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                Role.OFFICER,
                true
        );

        systemUserRepository.save(newUser);
    }
}
