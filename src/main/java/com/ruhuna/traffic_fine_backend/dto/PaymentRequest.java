package com.ruhuna.traffic_fine_backend.dto;

public class PaymentRequest {

    private String referenceNumber;
    private String categoryCode;
    private String officerBadgeNumber;

    private String driverName;
    private String driverLicenseNumber;
    private String vehicleNumber;

    private String paymentMethod;

    public PaymentRequest() {
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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
