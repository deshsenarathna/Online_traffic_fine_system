package com.ruhuna.traffic_fine_backend.Entity;

import jakarta.persistence.*;

@Entity
public class PoliceOfficer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String officerName;
    private String badgeNumber;
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    public PoliceOfficer() {
    }

    public Long getId() {
        return id;
    }

    public String getOfficerName() {
        return officerName;
    }

    public void setOfficerName(String officerName) {
        this.officerName = officerName;
    }

    public String getBadgeNumber() {
        return badgeNumber;
    }

    public void setBadgeNumber(String badgeNumber) {
        this.badgeNumber = badgeNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }

}
