package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.dto.CreateFineRequest;
import com.ruhuna.traffic_fine_backend.dto.CreateFineResponse;
import com.ruhuna.traffic_fine_backend.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins = "*")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createFine(@RequestBody CreateFineRequest request) {
        try {
            CreateFineResponse response = fineService.createFine(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("message", "Unable to verify the fine details. " + e.getMessage()));
        }
    }
}

