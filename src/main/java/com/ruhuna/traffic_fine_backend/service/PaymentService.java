package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import com.ruhuna.traffic_fine_backend.Entity.Payment;
import com.ruhuna.traffic_fine_backend.dto.PayFineRequest;
import com.ruhuna.traffic_fine_backend.dto.PayFineResponse;
import com.ruhuna.traffic_fine_backend.dto.PaymentInitiateResponse;
import com.ruhuna.traffic_fine_backend.repository.FineRepository;
import com.ruhuna.traffic_fine_backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;


@Service
public class PaymentService {

    private final FineRepository fineRepository;
    private final PaymentRepository paymentRepository;
    private final PayHerePaymentGatewayService payHerePaymentGatewayService;

    public PaymentService(FineRepository fineRepository,
                          PaymentRepository paymentRepository,
                          PayHerePaymentGatewayService payHerePaymentGatewayService) {
        this.fineRepository = fineRepository;
        this.paymentRepository = paymentRepository;
        this.payHerePaymentGatewayService = payHerePaymentGatewayService;
    }

    public PaymentInitiateResponse initiatePayment(PayFineRequest request) {

        Fine fine = fineRepository.findByReferenceNumber(request.getReferenceNumber())
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if ("PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new RuntimeException("This fine is already paid");
        }

        if (paymentRepository.existsByFineId(fine.getId())) {
            throw new RuntimeException("Payment already initiated for this fine");
        }

        String paymentReference = generatePaymentReference();

        Payment payment = new Payment();
        payment.setPaymentReference(paymentReference);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(fine.getAmount());
        payment.setPaymentStatus("PENDING");
        payment.setPaymentGatewayName("PAYHERE");
        payment.setGatewayPaymentUrl(payHerePaymentGatewayService.getCheckoutUrl());
        payment.setInitiatedDateTime(LocalDateTime.now());
        payment.setFine(fine);

        paymentRepository.save(payment);

        Map<String, String> payHereParams =
                payHerePaymentGatewayService.buildPaymentParams(fine, paymentReference);

        return new PaymentInitiateResponse(
                "Payment initiated",
                paymentReference,
                fine.getReferenceNumber(),
                fine.getAmount(),
                "PENDING",
                payHerePaymentGatewayService.getCheckoutUrl(),
                payHereParams
        );
    }

    public void handlePayHereNotification(String merchantId,
                                          String orderId,
                                          String paymentId,
                                          String payhereAmount,
                                          String payhereCurrency,
                                          String statusCode,
                                          String md5sig,
                                          String method,
                                          String statusMessage) {

        boolean valid = payHerePaymentGatewayService.verifyNotification(
                merchantId,
                orderId,
                payhereAmount,
                payhereCurrency,
                statusCode,
                md5sig
        );

        if (!valid) {
            throw new RuntimeException("Invalid PayHere notification signature");
        }

        Payment payment = paymentRepository.findByPaymentReference(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Fine fine = payment.getFine();

        if ("2".equals(statusCode)) {
            payment.setPaymentStatus("SUCCESS");
            payment.setGatewayTransactionId(paymentId);
            payment.setPaymentMethod(method);
            payment.setPaidDateTime(LocalDateTime.now());

            fine.setStatus("PAID");
            fineRepository.save(fine);
        } else if ("0".equals(statusCode)) {
            payment.setPaymentStatus("PENDING");
        } else {
            payment.setPaymentStatus("FAILED");
        }

        paymentRepository.save(payment);
    }

    private String generatePaymentReference() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
