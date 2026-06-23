package com.ruhuna.traffic_fine_backend.dto;

import java.util.Map;

public class PaymentInitiateResponse {

    private String message;
    private String paymentReference;
    private String referenceNumber;
    private Double amount;
    private String paymentStatus;
    private String checkoutUrl;
    private Map<String, String> payHereParams;

    public PaymentInitiateResponse() {
    }

    public PaymentInitiateResponse(String message,
                                   String paymentReference,
                                   String referenceNumber,
                                   Double amount,
                                   String paymentStatus,
                                   String checkoutUrl,
                                   Map<String, String> payHereParams) {
        this.message = message;
        this.paymentReference = paymentReference;
        this.referenceNumber = referenceNumber;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.checkoutUrl = checkoutUrl;
        this.payHereParams = payHereParams;
    }

    public String getMessage() {
        return message;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public Double getAmount() {
        return amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public Map<String, String> getPayHereParams() {
        return payHereParams;
    }
}
