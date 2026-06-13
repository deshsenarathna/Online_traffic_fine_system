package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import com.ruhuna.traffic_fine_backend.Entity.FineCategory;
import com.ruhuna.traffic_fine_backend.Entity.PoliceOfficer;
import com.ruhuna.traffic_fine_backend.dto.CreateFineRequest;
import com.ruhuna.traffic_fine_backend.dto.CreateFineResponse;
import com.ruhuna.traffic_fine_backend.exception.BadRequestException;
import com.ruhuna.traffic_fine_backend.exception.ConflictException;
import com.ruhuna.traffic_fine_backend.repository.FineCategoryRepository;
import com.ruhuna.traffic_fine_backend.repository.FineRepository;
import com.ruhuna.traffic_fine_backend.repository.PoliceOfficerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FineService {

    private final FineRepository fineRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final PoliceOfficerRepository policeOfficerRepository;

    public FineService(FineRepository fineRepository,
                       FineCategoryRepository fineCategoryRepository,
                       PoliceOfficerRepository policeOfficerRepository) {
        this.fineRepository = fineRepository;
        this.fineCategoryRepository = fineCategoryRepository;
        this.policeOfficerRepository = policeOfficerRepository;
    }

    public CreateFineResponse createFine(CreateFineRequest request) {

        if (fineRepository.existsByReferenceNumber(request.getReferenceNumber())) {
            throw new ConflictException("This reference number is already used");
        }

        FineCategory fineCategory = fineCategoryRepository
                .findByCategoryCode(request.getCategoryCode())
                .orElseThrow(() -> new BadRequestException("Invalid fine category code"));

        PoliceOfficer policeOfficer = policeOfficerRepository
                .findByBadgeNumber(request.getOfficerBadgeNumber())
                .orElseThrow(() -> new BadRequestException("Invalid officer badge number"));

        Fine fine = new Fine();
        fine.setReferenceNumber(request.getReferenceNumber());
        fine.setDriverName(request.getDriverName());
        fine.setDriverLicenseNumber(request.getDriverLicenseNumber());
        fine.setVehicleNumber(request.getVehicleNumber());

        fine.setAmount(fineCategory.getAmount());
        fine.setStatus("PENDING");
        fine.setIssuedDate(LocalDateTime.now());

        fine.setFineCategory(fineCategory);
        fine.setPoliceOfficer(policeOfficer);
        fine.setDistrict(policeOfficer.getDistrict());

        Fine savedFine = fineRepository.save(fine);

        return new CreateFineResponse(
                "Fine record created successfully",
                savedFine.getReferenceNumber(),
                savedFine.getFineCategory().getCategoryCode(),
                savedFine.getFineCategory().getCategoryName(),
                savedFine.getAmount(),
                savedFine.getDriverName(),
                savedFine.getVehicleNumber(),
                savedFine.getPoliceOfficer().getOfficerName(),
                savedFine.getDistrict().getDistrictName(),
                savedFine.getStatus()
        );
    }
}
