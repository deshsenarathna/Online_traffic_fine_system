package com.ruhuna.traffic_fine_backend.repository;

import com.ruhuna.traffic_fine_backend.Entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByLicenseNumber(String licenseNumber);
}
