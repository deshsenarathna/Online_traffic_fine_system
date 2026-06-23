package com.ruhuna.traffic_fine_backend.dto;

public class OfficerResponse {
    private Long id;
    private String officerName;
    private String badgeNumber;
    private String phoneNumber;
    private Long districtId;
    private String districtName;

    public OfficerResponse(Long id, String officerName, String badgeNumber,
                           String phoneNumber, Long districtId, String districtName) {
        this.id = id;
        this.officerName = officerName;
        this.badgeNumber = badgeNumber;
        this.phoneNumber = phoneNumber;
        this.districtId = districtId;
        this.districtName = districtName;
    }

    public Long getId() { return id; }
    public String getOfficerName() { return officerName; }
    public String getBadgeNumber() { return badgeNumber; }
    public String getPhoneNumber() { return phoneNumber; }
    public Long getDistrictId() { return districtId; }
    public String getDistrictName() { return districtName; }
}
