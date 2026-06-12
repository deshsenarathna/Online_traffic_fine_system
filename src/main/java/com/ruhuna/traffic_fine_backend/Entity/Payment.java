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

    private LocalDateTime paidDateTime;

    @OneToOne
    @JoinColumn(name = "fine_id")
    private Fine fine;

    public Payment() {
    }

    public Payment(String paymentReference, String paymentMethod, Double amount,
                   String paymentStatus, LocalDateTime paidDateTime, Fine fine) {
        this.paymentReference = paymentReference;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.paidDateTime = paidDateTime;
        this.fine = fine;
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
