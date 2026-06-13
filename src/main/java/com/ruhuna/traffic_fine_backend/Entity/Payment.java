package com.ruhuna.traffic_fine_backend.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentReference;
    private String paymentMethod;
    private Double amount;
    private String paymentStatus;

    private String gatewayTransactionId;
    private String paymentGatewayName;
    private String gatewayPaymentUrl;

    private LocalDateTime initiatedDateTime;
    private LocalDateTime paidDateTime;

    @OneToOne
    @JoinColumn(name = "fine_id")
    private Fine fine;

    public Payment() {
    }

    public Long getId() {
        return id;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
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

    public String getGatewayTransactionId() {
        return gatewayTransactionId;
    }

    public void setGatewayTransactionId(String gatewayTransactionId) {
        this.gatewayTransactionId = gatewayTransactionId;
    }

    public String getPaymentGatewayName() {
        return paymentGatewayName;
    }

    public void setPaymentGatewayName(String paymentGatewayName) {
        this.paymentGatewayName = paymentGatewayName;
    }

    public String getGatewayPaymentUrl() {
        return gatewayPaymentUrl;
    }

    public void setGatewayPaymentUrl(String gatewayPaymentUrl) {
        this.gatewayPaymentUrl = gatewayPaymentUrl;
    }

    public LocalDateTime getInitiatedDateTime() {
        return initiatedDateTime;
    }

    public void setInitiatedDateTime(LocalDateTime initiatedDateTime) {
        this.initiatedDateTime = initiatedDateTime;
    }

    public LocalDateTime getPaidDateTime() {
        return paidDateTime;
    }

    public void setPaidDateTime(LocalDateTime paidDateTime) {
        this.paidDateTime = paidDateTime;
    }

    public Fine getFine() {
        return fine;
    }

    public void setFine(Fine fine) {
        this.fine = fine;
    }
}
