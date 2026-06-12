package com.ruhuna.traffic_fine_backend.repository;

import com.ruhuna.traffic_fine_backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentReference(String paymentReference);

    boolean existsByFineId(Long fineId);
}
