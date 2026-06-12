package com.ruhuna.traffic_fine_backend.repository;

import com.ruhuna.traffic_fine_backend.Entity.PoliceOfficer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PoliceOfficerRepository extends JpaRepository<PoliceOfficer, Long> {

    Optional<PoliceOfficer> findByBadgeNumber(String badgeNumber);
    
}