package com.ruhuna.traffic_fine_backend.dto;

public class DistrictDto {
    private Long id;
    private String districtName;

    public DistrictDto(Long id, String districtName) {
        this.id = id;
        this.districtName = districtName;
    }

    public Long getId() { return id; }
    public String getDistrictName() { return districtName; }
}
