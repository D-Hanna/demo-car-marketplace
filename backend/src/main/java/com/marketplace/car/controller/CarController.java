package com.marketplace.car.controller;

import com.marketplace.car.dto.CarRequest;
import com.marketplace.car.dto.CarResponse;
import com.marketplace.car.service.CarService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cars")
@Validated
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CarResponse>> getCars(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) @PositiveOrZero(message = "maxPrice must be greater than or equal to 0") BigDecimal maxPrice,
            @RequestParam(required = false) @Min(value = 1900, message = "minYear must be greater than or equal to 1900") Integer minYear) {
        List<CarResponse> cars = carService.getCars(make, maxPrice, minYear);
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CarResponse> getCarById(@PathVariable Long id) {
        CarResponse car = carService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CarRequest request) {
        CarResponse createdCar = carService.createCar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdCar.id())
                .toUri();
        return ResponseEntity.created(location).body(createdCar);
    }
}
