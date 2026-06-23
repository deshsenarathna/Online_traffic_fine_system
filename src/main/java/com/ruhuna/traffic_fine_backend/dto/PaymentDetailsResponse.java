package com.ruhuna.traffic_fine_backend.dto;

import java.time.LocalDateTime;

public class PaymentDetailsResponse {
    private String paymentReference;
    private Double amount;
    private String paymentStatus;
    private String paymentMethod;
    private String gatewayTransactionId;
    private LocalDateTime paidDateTime;
    private String fineReferenceNumber;
    private String driverName;
    private String driverLicenseNumber;
    private String vehicleNumber;
    private String fineCategoryName;

    public PaymentDetailsResponse() {}

    public PaymentDetailsResponse(String paymentReference, Double amount, String paymentStatus, 
                                  String paymentMethod, String gatewayTransactionId, LocalDateTime paidDateTime, 
                                  String fineReferenceNumber, String driverName, String driverLicenseNumber, 
                                  String vehicleNumber, String fineCategoryName) {
        this.paymentReference = paymentReference;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.gatewayTransactionId = gatewayTransactionId;
        this.paidDateTime = paidDateTime;
        this.fineReferenceNumber = fineReferenceNumber;
        this.driverName = driverName;
        this.driverLicenseNumber = driverLicenseNumber;
        this.vehicleNumber = vehicleNumber;
        this.fineCategoryName = fineCategoryName;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getGatewayTransactionId() {
        return gatewayTransactionId;
    }

    public void setGatewayTransactionId(String gatewayTransactionId) {
        this.gatewayTransactionId = gatewayTransactionId;
    }

    public LocalDateTime getPaidDateTime() {
        return paidDateTime;
    }

    public void setPaidDateTime(LocalDateTime paidDateTime) {
        this.paidDateTime = paidDateTime;
    }

    public String getFineReferenceNumber() {
        return fineReferenceNumber;
    }

    public void setFineReferenceNumber(String fineReferenceNumber) {
        this.fineReferenceNumber = fineReferenceNumber;
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

    public String getFineCategoryName() {
        return fineCategoryName;
    }

    public void setFineCategoryName(String fineCategoryName) {
        this.fineCategoryName = fineCategoryName;
    }
}
