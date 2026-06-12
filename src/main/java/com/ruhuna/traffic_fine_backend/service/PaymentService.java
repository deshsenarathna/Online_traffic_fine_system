package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import com.ruhuna.traffic_fine_backend.Entity.Payment;
import com.ruhuna.traffic_fine_backend.dto.PayFineRequest;
import com.ruhuna.traffic_fine_backend.dto.PayFineResponse;
import com.ruhuna.traffic_fine_backend.repository.FineRepository;
import com.ruhuna.traffic_fine_backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
public class PaymentService {

    private final FineRepository fineRepository;
    private final PaymentRepository paymentRepository;

    public PaymentService(FineRepository fineRepository,
                          PaymentRepository paymentRepository) {
        this.fineRepository = fineRepository;
        this.paymentRepository = paymentRepository;
    }

    public PayFineResponse payFine(PayFineRequest request) {

        Fine fine = fineRepository.findByReferenceNumber(request.getReferenceNumber())
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if ("PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new RuntimeException("This fine is already paid");
        }

        if (paymentRepository.existsByFineId(fine.getId())) {
            throw new RuntimeException("Payment already exists for this fine");
        }

        String paymentReference = generatePaymentReference();

        Payment payment = new Payment();
        payment.setPaymentReference(paymentReference);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(fine.getAmount());
        payment.setPaymentStatus("SUCCESS");
        payment.setPaidDateTime(LocalDateTime.now());
        payment.setFine(fine);

        paymentRepository.save(payment);

        fine.setStatus("PAID");
        fineRepository.save(fine);

        return new PayFineResponse(
                "Payment successful",
                fine.getReferenceNumber(),
                paymentReference,
                fine.getAmount(),
                fine.getStatus(),
                payment.getPaymentStatus()
        );
    }

    private String generatePaymentReference() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
