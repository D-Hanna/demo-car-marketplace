package com.marketplace.car.service;

import com.marketplace.car.dto.CarRequest;
import com.marketplace.car.dto.CarResponse;
import com.marketplace.car.exception.ResourceNotFoundException;
import com.marketplace.car.model.Car;
import com.marketplace.car.repository.CarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;

    public CarServiceImpl(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public List<CarResponse> getCars(String make, BigDecimal maxPrice, Integer minYear) {
        String trimmedMake = (make != null && !make.isBlank()) ? make.trim() : null;
        return carRepository.findCarsWithFilters(trimmedMake, maxPrice, minYear)
                .stream()
                .map(CarResponse::fromEntity)
                .toList();
    }

    @Override
    public CarResponse getCarById(Long id) {
        return carRepository.findById(id)
                .map(CarResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
    }

    @Override
    @Transactional
    public CarResponse createCar(CarRequest request) {
        Car car = Car.builder()
                .make(request.make().trim())
                .model(request.model().trim())
                .year(request.year())
                .mileage(request.mileage())
                .price(request.price())
                .fuelType(request.fuelType())
                .imageUrl(request.imageUrl() != null ? request.imageUrl().trim() : null)
                .build();

        Car savedCar = carRepository.save(car);
        return CarResponse.fromEntity(savedCar);
    }
}
