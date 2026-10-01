package com.marketplace.car.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String make;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(name = "car_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer mileage;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 30)
    private FuelType fuelType;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    public Car() {
    }

    public Car(Long id, String make, String model, Integer year, Integer mileage, BigDecimal price, FuelType fuelType, String imageUrl) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.mileage = mileage;
        this.price = price;
        this.fuelType = fuelType;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String make;
        private String model;
        private Integer year;
        private Integer mileage;
        private BigDecimal price;
        private FuelType fuelType;
        private String imageUrl;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder make(String make) {
            this.make = make;
            return this;
        }

        public Builder model(String model) {
            this.model = model;
            return this;
        }

        public Builder year(Integer year) {
            this.year = year;
            return this;
        }

        public Builder mileage(Integer mileage) {
            this.mileage = mileage;
            return this;
        }

        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public Builder fuelType(FuelType fuelType) {
            this.fuelType = fuelType;
            return this;
        }

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Car build() {
            return new Car(id, make, model, year, mileage, price, fuelType, imageUrl);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Car car = (Car) o;
        return Objects.equals(id, car.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", make='" + make + '\'' +
                ", model='" + model + '\'' +
                ", year=" + year +
                ", mileage=" + mileage +
                ", price=" + price +
                ", fuelType=" + fuelType +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
