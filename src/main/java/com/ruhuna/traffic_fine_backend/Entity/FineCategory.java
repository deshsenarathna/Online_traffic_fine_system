package com.ruhuna.traffic_fine_backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FineCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String categoryCode;

    private String categoryName;

    private Double amount;

    public FineCategory() {

    }

    public FineCategory(String categoryCode, String categoryName, Double amount) {
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
