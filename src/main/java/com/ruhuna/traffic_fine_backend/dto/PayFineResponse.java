package com.ruhuna.traffic_fine_backend.dto;

public class PayFineResponse {

    private String message;
    private String referenceNumber;
    private String paymentReference;
    private Double amount;
    private String fineStatus;
    private String paymentStatus;

    public PayFineResponse() {
    }

    public PayFineResponse(String message,
                           String referenceNumber,
                           String paymentReference,
                           Double amount,
                           String fineStatus,
                           String paymentStatus) {
        this.message = message;
        this.referenceNumber = referenceNumber;
        this.paymentReference = paymentReference;
        this.amount = amount;
        this.fineStatus = fineStatus;
        this.paymentStatus = paymentStatus;
    }

    public String getMessage() {
        return message;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public Double getAmount() {
        return amount;
    }

    public String getFineStatus() {
        return fineStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }
}
