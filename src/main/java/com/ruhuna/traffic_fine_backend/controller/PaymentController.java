package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.dto.PayFineRequest;
import com.ruhuna.traffic_fine_backend.dto.PayFineResponse;
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

    @PostMapping("/pay-fine")
    public ResponseEntity<PayFineResponse> payFine(@RequestBody PayFineRequest request) {
        PayFineResponse response = paymentService.payFine(request);
        return ResponseEntity.ok(response);
    }
}
