package com.ruhuna.traffic_fine_backend.repository;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {

    // Reference Number එකෙන් Fine එක හොයන්න
    Optional<Fine> findByReferenceNumber(String referenceNumber);

    // යාළුවාගේ FineService එකට ඕනෙ කරපු අලුත් Method එක මෙන්න
    boolean existsByReferenceNumber(String referenceNumber);

    // Admin Dashboard එකට ඕනෙ කරපු Methods දෙක
    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.status = 'PAID'")
    Double calculateTotalRevenue();
}