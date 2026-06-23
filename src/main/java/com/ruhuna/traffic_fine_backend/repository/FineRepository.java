package com.ruhuna.traffic_fine_backend.repository;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import com.ruhuna.traffic_fine_backend.dto.CategoryCollectionDto;
import com.ruhuna.traffic_fine_backend.dto.DistrictCollectionDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {

    Optional<Fine> findByReferenceNumber(String referenceNumber);

    boolean existsByReferenceNumber(String referenceNumber);

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.status = 'PAID'")
    Double getTotalCollected();

    @Query("SELECT COUNT(f) FROM Fine f")
    Long getTotalFines();

    @Query("SELECT COUNT(f) FROM Fine f WHERE f.status = 'PAID'")
    Long getPaidFinesCount();

    @Query("SELECT COUNT(f) FROM Fine f WHERE f.status = 'PENDING'")
    Long getUnpaidFinesCount();

    @Query("SELECT new com.ruhuna.traffic_fine_backend.dto.DistrictCollectionDto(f.district.districtName, SUM(f.amount)) " +
           "FROM Fine f WHERE f.status = 'PAID' GROUP BY f.district.districtName")
    List<DistrictCollectionDto> getCollectionsByDistrict();

    @Query("SELECT new com.ruhuna.traffic_fine_backend.dto.CategoryCollectionDto(f.fineCategory.categoryName, SUM(f.amount), COUNT(f)) " +
           "FROM Fine f WHERE f.status = 'PAID' GROUP BY f.fineCategory.categoryName")
    List<CategoryCollectionDto> getCollectionsByCategory();

    @Query("SELECT f FROM Fine f WHERE " +
           "(:district IS NULL OR f.district.districtName = :district) AND " +
           "(:fromDate IS NULL OR f.issuedDate >= :fromDate) AND " +
           "(:toDate IS NULL OR f.issuedDate <= :toDate)")
    List<Fine> searchFines(@Param("district") String district,
                           @Param("fromDate") LocalDateTime fromDate,
                           @Param("toDate") LocalDateTime toDate);
}
