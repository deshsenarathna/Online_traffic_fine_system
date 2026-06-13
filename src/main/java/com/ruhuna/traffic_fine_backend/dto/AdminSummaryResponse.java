package com.ruhuna.traffic_fine_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSummaryResponse {
    private Double totalCollected;
    private Long totalFines;
    private Long paid;
    private Long unpaid;
}