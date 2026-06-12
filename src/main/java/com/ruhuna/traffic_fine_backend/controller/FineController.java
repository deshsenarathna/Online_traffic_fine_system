package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.dto.CreateFineRequest;
import com.ruhuna.traffic_fine_backend.dto.CreateFineResponse;
import com.ruhuna.traffic_fine_backend.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins = "*")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateFineResponse> createFine(@RequestBody CreateFineRequest request) {
        CreateFineResponse response = fineService.createFine(request);
        return ResponseEntity.ok(response);
    }

}
