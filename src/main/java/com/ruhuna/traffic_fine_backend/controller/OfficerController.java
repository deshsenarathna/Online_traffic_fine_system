package com.ruhuna.traffic_fine_backend.controller;

import com.ruhuna.traffic_fine_backend.dto.DistrictDto;
import com.ruhuna.traffic_fine_backend.dto.OfficerRequest;
import com.ruhuna.traffic_fine_backend.dto.OfficerResponse;
import com.ruhuna.traffic_fine_backend.service.OfficerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;
    }

    @GetMapping("/officers")
    public List<OfficerResponse> getOfficers() {
        return officerService.getAllOfficers();
    }

    @PostMapping("/officers")
    public OfficerResponse createOfficer(@RequestBody OfficerRequest request) {
        return officerService.createOfficer(request);
    }

    @PutMapping("/officers/{id}")
    public OfficerResponse updateOfficer(@PathVariable Long id, @RequestBody OfficerRequest request) {
        return officerService.updateOfficer(id, request);
    }

    @DeleteMapping("/officers/{id}")
    public void deleteOfficer(@PathVariable Long id) {
        officerService.deleteOfficer(id);
    }

    @GetMapping("/districts")
    public List<DistrictDto> getDistricts() {
        return officerService.getAllDistricts();
    }
}
