package com.marketplace.car.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketplace.car.dto.CarRequest;
import com.marketplace.car.dto.CarResponse;
import com.marketplace.car.exception.GlobalExceptionHandler;
import com.marketplace.car.exception.ResourceNotFoundException;
import com.marketplace.car.model.FuelType;
import com.marketplace.car.service.CarService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CarController.class)
@Import(GlobalExceptionHandler.class)
@org.springframework.test.context.ActiveProfiles("test")
class CarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CarService carService;

    @Test
    @DisplayName("GET /api/v1/cars returns 200 and list of cars")
    void getCars_success_returns200() throws Exception {
        CarResponse car = new CarResponse(
                1L, "Tesla", "Model 3", 2023, 12500,
                new BigDecimal("38990.00"), FuelType.ELECTRIC, "https://example.com/tesla.jpg"
        );

        when(carService.getCars(null, null, null)).thenReturn(List.of(car));

        mockMvc.perform(get("/api/v1/cars"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].make", is("Tesla")))
                .andExpect(jsonPath("$[0].model", is("Model 3")))
                .andExpect(jsonPath("$[0].fuelType", is("ELECTRIC")));
    }

    @Test
    @DisplayName("GET /api/v1/cars with filters passes parameters to service")
    void getCars_withFilters_returnsFilteredList() throws Exception {
        CarResponse car = new CarResponse(
                2L, "BMW", "330i", 2022, 24000,
                new BigDecimal("34500.00"), FuelType.GASOLINE, "https://example.com/bmw.jpg"
        );

        when(carService.getCars(eq("BMW"), eq(new BigDecimal("35000.00")), eq(2020)))
                .thenReturn(List.of(car));

        mockMvc.perform(get("/api/v1/cars")
                        .param("make", "BMW")
                        .param("maxPrice", "35000.00")
                        .param("minYear", "2020"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].make", is("BMW")))
                .andExpect(jsonPath("$[0].model", is("330i")));
    }

    @Test
    @DisplayName("GET /api/v1/cars/{id} returns 200 when car exists")
    void getCarById_found_returns200() throws Exception {
        CarResponse car = new CarResponse(
                1L, "Tesla", "Model 3", 2023, 12500,
                new BigDecimal("38990.00"), FuelType.ELECTRIC, "https://example.com/tesla.jpg"
        );

        when(carService.getCarById(1L)).thenReturn(car);

        mockMvc.perform(get("/api/v1/cars/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.make", is("Tesla")))
                .andExpect(jsonPath("$.fuelType", is("ELECTRIC")));
    }

    @Test
    @DisplayName("GET /api/v1/cars/{id} returns 404 and ProblemDetail when car not found")
    void getCarById_notFound_returns404ProblemDetail() throws Exception {
        when(carService.getCarById(999L))
                .thenThrow(new ResourceNotFoundException("Car not found with id: 999"));

        mockMvc.perform(get("/api/v1/cars/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title", is("Not Found")))
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.detail", is("Car not found with id: 999")))
                .andExpect(jsonPath("$.instance", is("/api/v1/cars/999")));
    }

    @Test
    @DisplayName("POST /api/v1/cars with valid payload creates car and returns 201 Created")
    void createCar_validRequest_returns201() throws Exception {
        CarRequest request = new CarRequest(
                "Audi",
                "A4",
                2021,
                31000,
                new BigDecimal("31900.00"),
                FuelType.GASOLINE,
                "https://example.com/audi.jpg"
        );

        CarResponse response = new CarResponse(
                3L, "Audi", "A4", 2021, 31000,
                new BigDecimal("31900.00"), FuelType.GASOLINE, "https://example.com/audi.jpg"
        );

        when(carService.createCar(any(CarRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/api/v1/cars/3")))
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.make", is("Audi")))
                .andExpect(jsonPath("$.model", is("A4")))
                .andExpect(jsonPath("$.price", is(31900.00)));

        verify(carService).createCar(any(CarRequest.class));
    }

    @Test
    @DisplayName("POST /api/v1/cars with invalid payload returns 400 ProblemDetail with errors array")
    void createCar_invalidRequest_returns400ProblemDetail() throws Exception {
        // missing make, invalid year (< 1900), negative price, null fuelType
        CarRequest invalidRequest = new CarRequest(
                "",
                "A4",
                1899,
                -10,
                new BigDecimal("-5.00"),
                null,
                null
        );

        mockMvc.perform(post("/api/v1/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title", is("Bad Request")))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.detail", is("Invalid input parameters")))
                .andExpect(jsonPath("$.errors", hasItem("make is required")))
                .andExpect(jsonPath("$.errors", hasItem("year must be greater than or equal to 1900")))
                .andExpect(jsonPath("$.errors", hasItem("mileage must be greater than or equal to 0")))
                .andExpect(jsonPath("$.errors", hasItem("price must be greater than or equal to 0")))
                .andExpect(jsonPath("$.errors", hasItem("fuelType is required")));
    }

    @Test
    @DisplayName("POST /api/v1/cars with malformed JSON body returns 400 ProblemDetail")
    void createCar_malformedJson_returns400ProblemDetail() throws Exception {
        String malformedJson = "{ \"make\": \"Tesla\", \"fuelType\": \"INVALID_FUEL\" ";

        mockMvc.perform(post("/api/v1/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title", is("Bad Request")))
                .andExpect(jsonPath("$.status", is(400)));
    }
}
