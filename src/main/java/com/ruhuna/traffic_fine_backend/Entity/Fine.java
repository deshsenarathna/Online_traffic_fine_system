package com.ruhuna.traffic_fine_backend.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String referenceNumber;

    private String driverName;

    private String driverLicenseNumber;

    private String vehicleNumber;

    private Double amount;

    private String status;

    private LocalDateTime issuedDate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private FineCategory fineCategory;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    private PoliceOfficer policeOfficer;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    public Fine() {
    }

    public Fine(String referenceNumber, String driverName, String driverLicenseNumber,
                String vehicleNumber, Double amount, String status,
                LocalDateTime issuedDate, FineCategory fineCategory,
                PoliceOfficer policeOfficer, District district) {
        this.referenceNumber = referenceNumber;
        this.driverName = driverName;
        this.driverLicenseNumber = driverLicenseNumber;
        this.vehicleNumber = vehicleNumber;
        this.amount = amount;
        this.status = status;
        this.issuedDate = issuedDate;
        this.fineCategory = fineCategory;
        this.policeOfficer = policeOfficer;
        this.district = district;
    }

    public Long getId() {
        return id;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getIssuedDate() {
        return issuedDate;
    }

    public void setIssuedDate(LocalDateTime issuedDate) {
        this.issuedDate = issuedDate;
    }

    public FineCategory getFineCategory() {
        return fineCategory;
    }

    public void setFineCategory(FineCategory fineCategory) {
        this.fineCategory = fineCategory;
    }

    public PoliceOfficer getPoliceOfficer() {
        return policeOfficer;
    }

    public void setPoliceOfficer(PoliceOfficer policeOfficer) {
        this.policeOfficer = policeOfficer;
    }

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }

}
