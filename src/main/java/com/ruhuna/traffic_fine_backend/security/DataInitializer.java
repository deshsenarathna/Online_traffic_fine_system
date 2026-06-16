package com.ruhuna.traffic_fine_backend.security;

import com.ruhuna.traffic_fine_backend.Entity.District;
import com.ruhuna.traffic_fine_backend.Entity.FineCategory;
import com.ruhuna.traffic_fine_backend.Entity.PoliceOfficer;
import com.ruhuna.traffic_fine_backend.Entity.Role;
import com.ruhuna.traffic_fine_backend.Entity.SystemUser;
import com.ruhuna.traffic_fine_backend.repository.DistrictRepository;
import com.ruhuna.traffic_fine_backend.repository.FineCategoryRepository;
import com.ruhuna.traffic_fine_backend.repository.PoliceOfficerRepository;
import com.ruhuna.traffic_fine_backend.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the database with default users and reference data on first startup.
 * Only creates records if they do not already exist.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final SystemUserRepository systemUserRepository;
    private final DistrictRepository districtRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final PoliceOfficerRepository policeOfficerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            SystemUserRepository systemUserRepository,
            DistrictRepository districtRepository,
            FineCategoryRepository fineCategoryRepository,
            PoliceOfficerRepository policeOfficerRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.systemUserRepository = systemUserRepository;
        this.districtRepository = districtRepository;
        this.fineCategoryRepository = fineCategoryRepository;
        this.policeOfficerRepository = policeOfficerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // ── Seed default users ──────────────────────────────────────────────
        if (!systemUserRepository.existsByUsername("admin")) {
            SystemUser admin = new SystemUser(
                    "admin",
                    passwordEncoder.encode("Admin@1234"),
                    Role.ADMIN,
                    true
            );
            systemUserRepository.save(admin);
            System.out.println("[DataInitializer] Created default admin user: admin / Admin@1234");
        }

        if (!systemUserRepository.existsByUsername("officer1")) {
            SystemUser officer = new SystemUser(
                    "officer1",
                    passwordEncoder.encode("Officer@1234"),
                    Role.OFFICER,
                    true
            );
            systemUserRepository.save(officer);
            System.out.println("[DataInitializer] Created default officer user: officer1 / Officer@1234");
        }

        // ── Seed Districts ──────────────────────────────────────────────────
        if (districtRepository.count() == 0) {
            districtRepository.save(new District("Colombo"));
            districtRepository.save(new District("Gampaha"));
            districtRepository.save(new District("Kandy"));
            districtRepository.save(new District("Galle"));
            districtRepository.save(new District("Matara"));
            System.out.println("[DataInitializer] Seeded 5 districts.");
        }

        // ── Seed Fine Categories ────────────────────────────────────────────
        if (fineCategoryRepository.count() == 0) {
            fineCategoryRepository.save(new FineCategory("C001", "Speeding", 5000.00));
            fineCategoryRepository.save(new FineCategory("C002", "Red Light Violation", 3000.00));
            fineCategoryRepository.save(new FineCategory("C003", "Illegal Parking", 2000.00));
            fineCategoryRepository.save(new FineCategory("C004", "Driving Without License", 7500.00));
            fineCategoryRepository.save(new FineCategory("C005", "Not Wearing Seatbelt", 1500.00));
            System.out.println("[DataInitializer] Seeded 5 fine categories.");
        }

        // ── Seed Police Officers ────────────────────────────────────────────
        if (policeOfficerRepository.count() == 0) {
            District colombo = districtRepository.findAll().stream()
                    .filter(d -> d.getDistrictName().equals("Colombo"))
                    .findFirst().orElse(null);
            District gampaha = districtRepository.findAll().stream()
                    .filter(d -> d.getDistrictName().equals("Gampaha"))
                    .findFirst().orElse(null);
            District kandy = districtRepository.findAll().stream()
                    .filter(d -> d.getDistrictName().equals("Kandy"))
                    .findFirst().orElse(null);

            PoliceOfficer o1 = new PoliceOfficer();
            o1.setOfficerName("W.A. Perera");
            o1.setBadgeNumber("12345");
            o1.setPhoneNumber("0771234567");
            o1.setDistrict(colombo);
            policeOfficerRepository.save(o1);

            PoliceOfficer o2 = new PoliceOfficer();
            o2.setOfficerName("K.D. Silva");
            o2.setBadgeNumber("12346");
            o2.setPhoneNumber("0779876543");
            o2.setDistrict(gampaha);
            policeOfficerRepository.save(o2);

            PoliceOfficer o3 = new PoliceOfficer();
            o3.setOfficerName("R.M. Fernando");
            o3.setBadgeNumber("12347");
            o3.setPhoneNumber("0775551234");
            o3.setDistrict(kandy);
            policeOfficerRepository.save(o3);

            System.out.println("[DataInitializer] Seeded 3 police officers.");
        }
    }
}

