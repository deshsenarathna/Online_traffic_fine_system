package com.ruhuna.traffic_fine_backend.repository;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {

    boolean existsByReferenceNumber(String referenceNumber);

    Optional<Fine> findByReferenceNumber(String referenceNumber);
}
