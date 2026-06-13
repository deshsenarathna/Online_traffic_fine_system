package com.ruhuna.traffic_fine_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminFineDto {
    private String ref;
    private String category;
    private String district;
    private Double amount;
    private String status;
    private LocalDate date;
}