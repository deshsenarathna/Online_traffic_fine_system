package com.ruhuna.traffic_fine_backend.dto;

public class PaymentResponse {

    private String message;
    private String referenceNumber;
    private String paymentReference;
    private String categoryName;
    private Double amount;
    private String paymentStatus;

    public PaymentResponse() {
    }

    public PaymentResponse(String message,
                           String referenceNumber,
                           String paymentReference,
                           String categoryName,
                           Double amount,
                           String paymentStatus) {
        this.message = message;
        this.referenceNumber = referenceNumber;
        this.paymentReference = paymentReference;
        this.categoryName = categoryName;
        this.amount = amount;
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

    public String getCategoryName() {
        return categoryName;
    }

    public Double getAmount() {
        return amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }
}
