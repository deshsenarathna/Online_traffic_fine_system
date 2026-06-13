package com.ruhuna.traffic_fine_backend.dto;

public class AdminDashboardResponse {

    private long totalFines;
    private long paidFines;
    private long unpaidFines;
    private double totalRevenue;

    public AdminDashboardResponse(long totalFines, long paidFines, long unpaidFines, double totalRevenue) {
        this.totalFines = totalFines;
        this.paidFines = paidFines;
        this.unpaidFines = unpaidFines;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalFines() { return totalFines; }
    public long getPaidFines() { return paidFines; }
    public long getUnpaidFines() { return unpaidFines; }
    public double getTotalRevenue() { return totalRevenue; }
}