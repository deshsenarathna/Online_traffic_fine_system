package com.ruhuna.traffic_fine_backend.repository;

import com.ruhuna.traffic_fine_backend.Entity.FineCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FineCategoryRepository extends JpaRepository<FineCategory, Long> {

    Optional<FineCategory> findByCategoryCode(String categoryCode);
}
