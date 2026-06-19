package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.Driver;
import com.ruhuna.traffic_fine_backend.dto.DriverAuthResponse;
import com.ruhuna.traffic_fine_backend.dto.DriverLoginRequest;
import com.ruhuna.traffic_fine_backend.dto.DriverSignupRequest;
import com.ruhuna.traffic_fine_backend.repository.DriverRepository;
import com.ruhuna.traffic_fine_backend.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DriverAuthService {

    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public DriverAuthService(DriverRepository driverRepository,
                             PasswordEncoder passwordEncoder,
                             JwtUtils jwtUtils) {
        this.driverRepository = driverRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public DriverAuthResponse signup(DriverSignupRequest request) {
        if (driverRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("A driver with this email already exists");
        }

        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new RuntimeException("A driver with this license number already exists");
        }

        Driver driver = new Driver(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getLicenseNumber(),
                request.getPhoneNumber()
        );

        driverRepository.save(driver);

        String token = jwtUtils.generateToken(driver.getEmail());

        return new DriverAuthResponse(token, driver.getFullName(), driver.getEmail());
    }

    public DriverAuthResponse login(DriverLoginRequest request) {
        Driver driver = driverRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), driver.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(driver.getEmail());

        return new DriverAuthResponse(token, driver.getFullName(), driver.getEmail());
    }
}
