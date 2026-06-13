package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import com.ruhuna.traffic_fine_backend.Entity.Payment;
import com.ruhuna.traffic_fine_backend.Entity.PoliceOfficer;
import com.ruhuna.traffic_fine_backend.dto.PayFineRequest;
import com.ruhuna.traffic_fine_backend.dto.PayFineResponse;
import com.ruhuna.traffic_fine_backend.dto.PaymentInitiateResponse;
import com.ruhuna.traffic_fine_backend.exception.BadRequestException;
import com.ruhuna.traffic_fine_backend.exception.ConflictException;
import com.ruhuna.traffic_fine_backend.exception.ResourceNotFoundException;
import com.ruhuna.traffic_fine_backend.repository.FineRepository;
import com.ruhuna.traffic_fine_backend.repository.PaymentRepository;
import com.ruhuna.traffic_fine_backend.sms.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;


@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final FineRepository fineRepository;
    private final PaymentRepository paymentRepository;
    private final PayHerePaymentGatewayService payHerePaymentGatewayService;
    private final SmsService smsService;

    public PaymentService(FineRepository fineRepository,
                          PaymentRepository paymentRepository,
                          PayHerePaymentGatewayService payHerePaymentGatewayService,
                          SmsService smsService) {
        this.fineRepository = fineRepository;
        this.paymentRepository = paymentRepository;
        this.payHerePaymentGatewayService = payHerePaymentGatewayService;
        this.smsService = smsService;
    }

    public PaymentInitiateResponse initiatePayment(PayFineRequest request) {

        Fine fine = fineRepository.findByReferenceNumber(request.getReferenceNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found"));

        if ("PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new ConflictException("This fine is already paid");
        }

        if (paymentRepository.existsByFineId(fine.getId())) {
            throw new ConflictException("Payment already initiated for this fine");
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
            throw new BadRequestException("Invalid PayHere notification signature");
        }

        Payment payment = paymentRepository.findByPaymentReference(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        Fine fine = payment.getFine();

        if ("2".equals(statusCode)) {
            payment.setPaymentStatus("SUCCESS");
            payment.setGatewayTransactionId(paymentId);
            payment.setPaymentMethod(method);
            payment.setPaidDateTime(LocalDateTime.now());

            fine.setStatus("PAID");
            fineRepository.save(fine);

            // Notify the issuing officer so the driver can retrieve the license.
            // Isolated so an SMS failure never affects the payment outcome.
            notifyOfficerOfPayment(fine);
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

    /**
     * Sends a payment-confirmation SMS to the officer who issued the fine.
     * Any failure here is swallowed and logged: the payment has already been
     * recorded successfully and must not be rolled back because of SMS issues.
     */
    private void notifyOfficerOfPayment(Fine fine) {
        try {
            PoliceOfficer officer = fine.getPoliceOfficer();
            if (officer == null || officer.getPhoneNumber() == null
                    || officer.getPhoneNumber().isBlank()) {
                log.warn("Fine {} paid, but no officer phone number available for SMS.",
                        fine.getReferenceNumber());
                return;
            }

            String message = "Traffic Fine PAID. Ref: " + fine.getReferenceNumber()
                    + ", Vehicle: " + fine.getVehicleNumber()
                    + ", Amount: LKR " + fine.getAmount()
                    + ". The driver may now retrieve the license.";

            boolean sent = smsService.sendSms(officer.getPhoneNumber(), message);
            if (!sent) {
                log.warn("Payment SMS for fine {} was not delivered to officer {}.",
                        fine.getReferenceNumber(), officer.getBadgeNumber());
            }
        } catch (Exception e) {
            log.error("Unexpected error while sending payment SMS for fine {}: {}",
                    fine.getReferenceNumber(), e.getMessage());
        }
    }
}
