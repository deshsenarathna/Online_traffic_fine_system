package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.dto.AdminDashboardResponse;
import com.ruhuna.traffic_fine_backend.repository.FineRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final FineRepository fineRepository;

    public AdminService(FineRepository fineRepository) {
        this.fineRepository = fineRepository;
    }

    public AdminDashboardResponse getDashboardStats() {
        long totalFines = fineRepository.count();
        long paidFines = fineRepository.countByStatus("PAID");
        long unpaidFines = fineRepository.countByStatus("UNPAID"); // හෝ යාළුවා දාලා තියෙන status එක
        Double totalRevenue = fineRepository.calculateTotalRevenue();

        return new AdminDashboardResponse(totalFines, paidFines, unpaidFines, totalRevenue);
    }
}