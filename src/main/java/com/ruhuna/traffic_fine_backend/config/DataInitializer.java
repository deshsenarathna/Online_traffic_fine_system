package com.ruhuna.traffic_fine_backend.config;

import com.ruhuna.traffic_fine_backend.Entity.District;
import com.ruhuna.traffic_fine_backend.Entity.FineCategory;
import com.ruhuna.traffic_fine_backend.Entity.PoliceOfficer;
import com.ruhuna.traffic_fine_backend.repository.DistrictRepository;
import com.ruhuna.traffic_fine_backend.repository.FineCategoryRepository;
import com.ruhuna.traffic_fine_backend.repository.PoliceOfficerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DistrictRepository districtRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final PoliceOfficerRepository policeOfficerRepository;

    public DataInitializer(DistrictRepository districtRepository,
                           FineCategoryRepository fineCategoryRepository,
                           PoliceOfficerRepository policeOfficerRepository) {
        this.districtRepository = districtRepository;
        this.fineCategoryRepository = fineCategoryRepository;
        this.policeOfficerRepository = policeOfficerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Districts
        if (districtRepository.count() == 0) {
            districtRepository.save(new District("Colombo"));
            districtRepository.save(new District("Kandy"));
            districtRepository.save(new District("Galle"));
            districtRepository.save(new District("Matara"));
            System.out.println("--- Seeded Districts ---");
        }

        // Get a default district for officers
        District defaultDistrict = districtRepository.findAll().stream().findFirst().orElse(null);

        // 2. Seed Fine Categories (including C004)
        if (fineCategoryRepository.count() == 0) {
            fineCategoryRepository.save(new FineCategory("C001", "Speeding", 3000.0));
            fineCategoryRepository.save(new FineCategory("C002", "Reckless Driving", 5000.0));
            fineCategoryRepository.save(new FineCategory("C003", "Drunk Driving", 10000.0));
            fineCategoryRepository.save(new FineCategory("C004", "Parking Violation", 2000.0));
            fineCategoryRepository.save(new FineCategory("C005", "Traffic Light Violation", 2500.0));
            System.out.println("--- Seeded Fine Categories ---");
        }

        // 3. Seed Police Officers (including B123)
        if (policeOfficerRepository.count() == 0 && defaultDistrict != null) {
            PoliceOfficer officer1 = new PoliceOfficer();
            officer1.setOfficerName("Officer Silva");
            officer1.setBadgeNumber("B123");
            officer1.setPhoneNumber("0777123456");
            officer1.setDistrict(defaultDistrict);
            policeOfficerRepository.save(officer1);

            PoliceOfficer officer2 = new PoliceOfficer();
            officer2.setOfficerName("Officer Perera");
            officer2.setBadgeNumber("B001");
            officer2.setPhoneNumber("0777654321");
            officer2.setDistrict(defaultDistrict);
            policeOfficerRepository.save(officer2);

            System.out.println("--- Seeded Police Officers ---");
        }
    }
}
