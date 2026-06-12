package com.ruhuna.traffic_fine_backend.repository;
import com.ruhuna.traffic_fine_backend.Entity.District;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DistrictRepository extends JpaRepository<District, Long> {
}
