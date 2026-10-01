package com.marketplace.car.repository;

import com.marketplace.car.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("SELECT c FROM Car c WHERE " +
           "(:make IS NULL OR LOWER(c.make) LIKE LOWER(CONCAT('%', :make, '%'))) AND " +
           "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
           "(:minYear IS NULL OR c.year >= :minYear) " +
           "ORDER BY c.id ASC")
    List<Car> findCarsWithFilters(
        @Param("make") String make,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("minYear") Integer minYear
    );
}
