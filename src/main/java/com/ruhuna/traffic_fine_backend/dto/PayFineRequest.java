package com.ruhuna.traffic_fine_backend.dto;

public class PayFineRequest {

    private String referenceNumber;
    private String paymentMethod;

    public PayFineRequest() {
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
