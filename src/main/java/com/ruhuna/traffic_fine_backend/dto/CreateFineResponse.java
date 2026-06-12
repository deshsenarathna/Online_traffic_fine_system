package com.ruhuna.traffic_fine_backend.dto;

public class CreateFineResponse {

    private String message;
    private String referenceNumber;
    private String categoryCode;
    private String categoryName;
    private Double amount;
    private String driverName;
    private String vehicleNumber;
    private String officerName;
    private String districtName;
    private String status;

    public CreateFineResponse() {
    }

    public CreateFineResponse(String message,
                              String referenceNumber,
                              String categoryCode,
                              String categoryName,
                              Double amount,
                              String driverName,
                              String vehicleNumber,
                              String officerName,
                              String districtName,
                              String status) {
        this.message = message;
        this.referenceNumber = referenceNumber;
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
        this.amount = amount;
        this.driverName = driverName;
        this.vehicleNumber = vehicleNumber;
        this.officerName = officerName;
        this.districtName = districtName;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Double getAmount() {
        return amount;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public String getOfficerName() {
        return officerName;
    }

    public String getDistrictName() {
        return districtName;
    }

    public String getStatus() {
        return status;
    }
}
