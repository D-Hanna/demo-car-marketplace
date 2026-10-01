package com.marketplace.car;

import com.marketplace.car.model.Car;
import com.marketplace.car.model.FuelType;
import com.marketplace.car.repository.CarRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.util.List;

@SpringBootApplication
public class CarMarketplaceApplication {

    private static final Logger log = LoggerFactory.getLogger(CarMarketplaceApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(CarMarketplaceApplication.class, args);
    }

    @Bean
    @org.springframework.context.annotation.Profile("!test")
    public CommandLineRunner dataLoader(CarRepository carRepository) {
        return args -> {
            if (carRepository.count() > 0) {
                log.info("Database already seeded with {} cars. Skipping data loader.", carRepository.count());
                return;
            }

            log.info("Seeding initial car listings into H2 database...");

            List<Car> sampleCars = List.of(
                Car.builder()
                    .make("Tesla")
                    .model("Model 3")
                    .year(2023)
                    .mileage(12500)
                    .price(new BigDecimal("38990.00"))
                    .fuelType(FuelType.ELECTRIC)
                    .imageUrl("https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Car.builder()
                    .make("BMW")
                    .model("330i")
                    .year(2022)
                    .mileage(24000)
                    .price(new BigDecimal("34500.00"))
                    .fuelType(FuelType.GASOLINE)
                    .imageUrl("https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Car.builder()
                    .make("Audi")
                    .model("A4")
                    .year(2021)
                    .mileage(31000)
                    .price(new BigDecimal("31900.00"))
                    .fuelType(FuelType.GASOLINE)
                    .imageUrl("https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Car.builder()
                    .make("Porsche")
                    .model("Taycan")
                    .year(2023)
                    .mileage(8500)
                    .price(new BigDecimal("89900.00"))
                    .fuelType(FuelType.ELECTRIC)
                    .imageUrl("https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Car.builder()
                    .make("Ford")
                    .model("Mustang Mach-E")
                    .year(2022)
                    .mileage(19500)
                    .price(new BigDecimal("41500.00"))
                    .fuelType(FuelType.ELECTRIC)
                    .imageUrl("https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Car.builder()
                    .make("Toyota")
                    .model("RAV4 Hybrid")
                    .year(2023)
                    .mileage(15000)
                    .price(new BigDecimal("32900.00"))
                    .fuelType(FuelType.HYBRID)
                    .imageUrl("https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Car.builder()
                    .make("Volkswagen")
                    .model("Golf TDI")
                    .year(2020)
                    .mileage(45000)
                    .price(new BigDecimal("21500.00"))
                    .fuelType(FuelType.DIESEL)
                    .imageUrl("https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80")
                    .build(),
                Car.builder()
                    .make("Volvo")
                    .model("XC60 Recharge")
                    .year(2023)
                    .mileage(11000)
                    .price(new BigDecimal("54900.00"))
                    .fuelType(FuelType.PLUGIN_HYBRID)
                    .imageUrl("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80")
                    .build()
            );

            carRepository.saveAll(sampleCars);
            log.info("Successfully seeded {} sample cars into H2 database.", sampleCars.size());
        };
    }
}
