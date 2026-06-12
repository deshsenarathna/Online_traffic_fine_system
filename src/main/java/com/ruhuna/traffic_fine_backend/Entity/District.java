package com.ruhuna.traffic_fine_backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;//primary key of the table district

    private String districtName;

    public District() {
        
    }

    public District(String districtName) {
        this.districtName = districtName;
    }

    public Long getId() {
        return id;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }
}
