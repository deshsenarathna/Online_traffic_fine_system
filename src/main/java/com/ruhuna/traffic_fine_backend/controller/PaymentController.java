package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.dto.PayFineRequest;
import com.ruhuna.traffic_fine_backend.dto.PayFineResponse;
import com.ruhuna.traffic_fine_backend.dto.PaymentInitiateResponse;
import com.ruhuna.traffic_fine_backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {

        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    public ResponseEntity<PaymentInitiateResponse> initiatePayment(@RequestBody PayFineRequest request) {
        PaymentInitiateResponse response = paymentService.initiatePayment(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/notify")
    public ResponseEntity<String> handlePayHereNotification(

            @RequestParam("merchant_id") String merchantId,
            @RequestParam("order_id") String orderId,
            @RequestParam("payment_id") String paymentId,
            @RequestParam("payhere_amount") String payhereAmount,
            @RequestParam("payhere_currency") String payhereCurrency,
            @RequestParam("status_code") String statusCode,
            @RequestParam("md5sig") String md5sig,
            @RequestParam(value = "method", required = false) String method,
            @RequestParam(value = "status_message", required = false) String statusMessage
    ) {

        System.out.println("=== PAYMENT NOTIFY CONTROLLER HIT ===");
        System.out.println("orderId = " + orderId);
        System.out.println("statusCode = " + statusCode);

        paymentService.handlePayHereNotification(
                merchantId,
                orderId,
                paymentId,
                payhereAmount,
                payhereCurrency,
                statusCode,
                md5sig,
                method,
                statusMessage
        );

        return ResponseEntity.ok("Notification received");
    }

    @GetMapping("/details/{paymentReference}")
    public ResponseEntity<com.ruhuna.traffic_fine_backend.dto.PaymentDetailsResponse> getPaymentDetails(@PathVariable("paymentReference") String paymentReference) {
        com.ruhuna.traffic_fine_backend.dto.PaymentDetailsResponse response = paymentService.getPaymentDetails(paymentReference);
        return ResponseEntity.ok(response);
    }
}
