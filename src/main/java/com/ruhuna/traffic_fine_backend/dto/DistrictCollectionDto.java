package com.ruhuna.traffic_fine_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistrictCollectionDto {
    private String district;
    private Double total;
}