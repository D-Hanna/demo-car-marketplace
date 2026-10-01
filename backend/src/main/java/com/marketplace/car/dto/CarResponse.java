package com.marketplace.car.dto;

import com.marketplace.car.model.Car;
import com.marketplace.car.model.FuelType;
import java.math.BigDecimal;

public record CarResponse(
    Long id,
    String make,
    String model,
    Integer year,
    Integer mileage,
    BigDecimal price,
    FuelType fuelType,
    String imageUrl
) {
    public static CarResponse fromEntity(Car car) {
        if (car == null) {
            return null;
        }
        return new CarResponse(
            car.getId(),
            car.getMake(),
            car.getModel(),
            car.getYear(),
            car.getMileage(),
            car.getPrice(),
            car.getFuelType(),
            car.getImageUrl()
        );
    }
}
