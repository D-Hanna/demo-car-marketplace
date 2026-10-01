package com.marketplace.car.service;

import com.marketplace.car.dto.CarRequest;
import com.marketplace.car.dto.CarResponse;
import com.marketplace.car.exception.ResourceNotFoundException;
import com.marketplace.car.model.Car;
import com.marketplace.car.model.FuelType;
import com.marketplace.car.repository.CarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @InjectMocks
    private CarServiceImpl carService;

    private Car sampleCar;

    @BeforeEach
    void setUp() {
        sampleCar = Car.builder()
                .id(1L)
                .make("Tesla")
                .model("Model 3")
                .year(2023)
                .mileage(12500)
                .price(new BigDecimal("38990.00"))
                .fuelType(FuelType.ELECTRIC)
                .imageUrl("https://example.com/tesla.jpg")
                .build();
    }

    @Test
    @DisplayName("getCars should return all cars when no filter params are provided")
    void getCars_withoutFilters_returnsAllCars() {
        when(carRepository.findCarsWithFilters(null, null, null))
                .thenReturn(List.of(sampleCar));

        List<CarResponse> result = carService.getCars(null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).make()).isEqualTo("Tesla");
        verify(carRepository, times(1)).findCarsWithFilters(null, null, null);
    }

    @Test
    @DisplayName("getCars should return matching cars when filters are provided")
    void getCars_withFilters_returnsFilteredCars() {
        BigDecimal maxPrice = new BigDecimal("40000.00");
        Integer minYear = 2020;
        when(carRepository.findCarsWithFilters(eq("Tesla"), eq(maxPrice), eq(minYear)))
                .thenReturn(List.of(sampleCar));

        List<CarResponse> result = carService.getCars(" Tesla ", maxPrice, minYear);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).model()).isEqualTo("Model 3");
        verify(carRepository, times(1)).findCarsWithFilters("Tesla", maxPrice, minYear);
    }

    @Test
    @DisplayName("getCarById should return car when id exists")
    void getCarById_existingId_returnsCarResponse() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(sampleCar));

        CarResponse result = carService.getCarById(1L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.make()).isEqualTo("Tesla");
        verify(carRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getCarById should throw ResourceNotFoundException when car does not exist")
    void getCarById_nonExistingId_throwsResourceNotFoundException() {
        when(carRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carService.getCarById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Car not found with id: 999");

        verify(carRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("createCar should map request, save entity and return CarResponse")
    void createCar_validRequest_savesAndReturnsCarResponse() {
        CarRequest request = new CarRequest(
                "BMW",
                "330i",
                2022,
                24000,
                new BigDecimal("34500.00"),
                FuelType.GASOLINE,
                "https://example.com/bmw.jpg"
        );

        Car savedCar = Car.builder()
                .id(2L)
                .make("BMW")
                .model("330i")
                .year(2022)
                .mileage(24000)
                .price(new BigDecimal("34500.00"))
                .fuelType(FuelType.GASOLINE)
                .imageUrl("https://example.com/bmw.jpg")
                .build();

        when(carRepository.save(any(Car.class))).thenReturn(savedCar);

        CarResponse result = carService.createCar(request);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(2L);
        assertThat(result.make()).isEqualTo("BMW");
        assertThat(result.model()).isEqualTo("330i");
        assertThat(result.fuelType()).isEqualTo(FuelType.GASOLINE);
        verify(carRepository, times(1)).save(any(Car.class));
    }
}
