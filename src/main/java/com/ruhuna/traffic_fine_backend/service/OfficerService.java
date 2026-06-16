package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.District;
import com.ruhuna.traffic_fine_backend.Entity.PoliceOfficer;
import com.ruhuna.traffic_fine_backend.dto.DistrictDto;
import com.ruhuna.traffic_fine_backend.dto.OfficerRequest;
import com.ruhuna.traffic_fine_backend.dto.OfficerResponse;
import com.ruhuna.traffic_fine_backend.repository.DistrictRepository;
import com.ruhuna.traffic_fine_backend.repository.PoliceOfficerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfficerService {

    private final PoliceOfficerRepository officerRepository;
    private final DistrictRepository districtRepository;

    public OfficerService(PoliceOfficerRepository officerRepository,
                          DistrictRepository districtRepository) {
        this.officerRepository = officerRepository;
        this.districtRepository = districtRepository;
    }

    public List<OfficerResponse> getAllOfficers() {
        return officerRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OfficerResponse createOfficer(OfficerRequest request) {
        if (officerRepository.findByBadgeNumber(request.getBadgeNumber()).isPresent()) {
            throw new RuntimeException("An officer with this badge number already exists");
        }
        District district = districtRepository.findById(request.getDistrictId())
                .orElseThrow(() -> new RuntimeException("Invalid district"));

        PoliceOfficer officer = new PoliceOfficer();
        officer.setOfficerName(request.getOfficerName());
        officer.setBadgeNumber(request.getBadgeNumber());
        officer.setPhoneNumber(request.getPhoneNumber());
        officer.setDistrict(district);

        return toResponse(officerRepository.save(officer));
    }

    public OfficerResponse updateOfficer(Long id, OfficerRequest request) {
        PoliceOfficer officer = officerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        // If the badge number changed, make sure the new one isn't taken.
        if (!officer.getBadgeNumber().equals(request.getBadgeNumber())
                && officerRepository.findByBadgeNumber(request.getBadgeNumber()).isPresent()) {
            throw new RuntimeException("An officer with this badge number already exists");
        }

        officer.setOfficerName(request.getOfficerName());
        officer.setBadgeNumber(request.getBadgeNumber());
        officer.setPhoneNumber(request.getPhoneNumber());

        if (request.getDistrictId() != null) {
            District district = districtRepository.findById(request.getDistrictId())
                    .orElseThrow(() -> new RuntimeException("Invalid district"));
            officer.setDistrict(district);
        }

        return toResponse(officerRepository.save(officer));
    }

    public void deleteOfficer(Long id) {
        officerRepository.deleteById(id);
    }

    public List<DistrictDto> getAllDistricts() {
        return districtRepository.findAll().stream()
                .map(d -> new DistrictDto(d.getId(), d.getDistrictName()))
                .collect(Collectors.toList());
    }

    private OfficerResponse toResponse(PoliceOfficer o) {
        Long districtId = (o.getDistrict() != null) ? o.getDistrict().getId() : null;
        String districtName = (o.getDistrict() != null) ? o.getDistrict().getDistrictName() : null;
        return new OfficerResponse(
                o.getId(), o.getOfficerName(), o.getBadgeNumber(),
                o.getPhoneNumber(), districtId, districtName
        );
    }
}
