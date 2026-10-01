package com.marketplace.car.dto;

import com.marketplace.car.model.FuelType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CarRequest(
    @NotBlank(message = "make is required")
    @Size(max = 100, message = "make cannot exceed 100 characters")
    String make,

    @NotBlank(message = "model is required")
    @Size(max = 100, message = "model cannot exceed 100 characters")
    String model,

    @NotNull(message = "year is required")
    @Min(value = 1900, message = "year must be greater than or equal to 1900")
    @Max(value = 2100, message = "year must be less than or equal to 2100")
    Integer year,

    @NotNull(message = "mileage is required")
    @Min(value = 0, message = "mileage must be greater than or equal to 0")
    Integer mileage,

    @NotNull(message = "price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "price must be greater than or equal to 0")
    BigDecimal price,

    @NotNull(message = "fuelType is required")
    FuelType fuelType,

    String imageUrl
) {}
