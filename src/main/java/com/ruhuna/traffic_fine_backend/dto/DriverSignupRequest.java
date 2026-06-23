package com.ruhuna.traffic_fine_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverSignupRequest {
    private String fullName;
    private String email;
    private String password;
    private String licenseNumber;
    private String phoneNumber;
}
