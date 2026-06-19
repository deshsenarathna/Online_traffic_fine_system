package com.ruhuna.traffic_fine_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateFineRequest {

    @NotBlank(message = "Fine reference number is required")
    @Pattern(
            regexp = "^REF\\d{5}$",
            message = "Reference number must use the format REF12345"
    )
    private String referenceNumber;

    @NotBlank(message = "Category code is required")
    @Pattern(
            regexp = "^C\\d{3}$",
            message = "Category code must use the format C001"
    )
    private String categoryCode;

    @NotBlank(message = "Officer badge number is required")
    @Pattern(
            regexp = "^B\\d{3}$",
            message = "Officer badge number must use the format OFF1234"
    )
    private String officerBadgeNumber;

    @NotBlank(message = "Driver name is required")
    @Size(min = 3, max = 60)
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Driver name can contain only letters and spaces"
    )
    private String driverName;

    @NotBlank(message = "Driving licence number is required")
    @Pattern(
            regexp = "^[A-Z]\\d{7}$",
            message = "Licence number must use the format B1234567"
    )
    private String driverLicenseNumber;

    @NotBlank(message = "Vehicle number is required")
    @Pattern(
            regexp = "^[A-Z]{2,3}-\\d{4}$",
            message = "Vehicle number must use the format CAA-1234"
    )
    private String vehicleNumber;

    public CreateFineRequest() {
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getOfficerBadgeNumber() {
        return officerBadgeNumber;
    }

    public void setOfficerBadgeNumber(String officerBadgeNumber) {
        this.officerBadgeNumber = officerBadgeNumber;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverLicenseNumber() {
        return driverLicenseNumber;
    }

    public void setDriverLicenseNumber(String driverLicenseNumber) {
        this.driverLicenseNumber = driverLicenseNumber;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
}
