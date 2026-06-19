package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import com.ruhuna.traffic_fine_backend.dto.AdminFineDto;
import com.ruhuna.traffic_fine_backend.dto.AdminSummaryResponse;
import com.ruhuna.traffic_fine_backend.dto.CategoryCollectionDto;
import com.ruhuna.traffic_fine_backend.dto.DistrictCollectionDto;
import com.ruhuna.traffic_fine_backend.repository.FineRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final FineRepository fineRepository;

    public AdminController(FineRepository fineRepository) {
        this.fineRepository = fineRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<AdminSummaryResponse> getSummary() {
        Double totalCollected = fineRepository.getTotalCollected();
        Long totalFines = fineRepository.getTotalFines();
        Long paid = fineRepository.getPaidFinesCount();
        Long unpaid = fineRepository.getUnpaidFinesCount();

        AdminSummaryResponse summary = new AdminSummaryResponse(
                totalCollected, totalFines, paid, unpaid
        );
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/collections/by-district")
    public ResponseEntity<List<DistrictCollectionDto>> getCollectionsByDistrict() {
        return ResponseEntity.ok(fineRepository.getCollectionsByDistrict());
    }

    @GetMapping("/collections/by-category")
    public ResponseEntity<List<CategoryCollectionDto>> getCollectionsByCategory() {
        return ResponseEntity.ok(fineRepository.getCollectionsByCategory());
    }

    @GetMapping("/fines")
    public ResponseEntity<List<AdminFineDto>> getFines(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        LocalDateTime fromDateTime = (from != null) ? from.atStartOfDay() : null;
        LocalDateTime toDateTime = (to != null) ? to.atTime(LocalTime.MAX) : null;

        List<Fine> fines = fineRepository.searchFines(district, fromDateTime, toDateTime);

        List<AdminFineDto> dtoList = fines.stream().map(f -> new AdminFineDto(
                f.getReferenceNumber(),
                f.getFineCategory() != null ? f.getFineCategory().getCategoryName() : null,
                f.getDistrict() != null ? f.getDistrict().getDistrictName() : null,
                f.getAmount(),
                f.getStatus(),
                f.getIssuedDate() != null ? f.getIssuedDate().toLocalDate() : null
        )).collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }
}