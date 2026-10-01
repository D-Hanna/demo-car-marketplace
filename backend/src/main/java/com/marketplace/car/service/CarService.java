package com.marketplace.car.service;

import com.marketplace.car.dto.CarRequest;
import com.marketplace.car.dto.CarResponse;

import java.math.BigDecimal;
import java.util.List;

public interface CarService {

    List<CarResponse> getCars(String make, BigDecimal maxPrice, Integer minYear);

    CarResponse getCarById(Long id);

    CarResponse createCar(CarRequest request);
}
