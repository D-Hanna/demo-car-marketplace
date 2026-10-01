# Car Marketplace Backend

Production-grade Spring Boot 3 backend service for the Car Marketplace platform, strictly adhering to the OpenAPI 3.0 specification (`specs/car-marketplace-api.yaml`) and project directives (`AGENTS.md`).

## Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.3.4 (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`)
- **Database**: H2 In-Memory DB (`jdbc:h2:mem:cardb`)
- **DTOs**: Java 21 Records (`CarRequest`, `CarResponse`)
- **Error Handling**: Structured RFC 7807 `ProblemDetail` (`application/problem+json`)
- **Testing**: JUnit 5, Mockito, Spring MockMvc
- **CORS**: Enabled for React Vite frontend (`http://localhost:5173`)

---

## REST API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/v1/cars` | Retrieve list of cars with optional filtering (`make`, `maxPrice`, `minYear`) | 200 |
| `GET` | `/api/v1/cars/{id}` | Get car details by ID | 200, 404 |
| `POST` | `/api/v1/cars` | Create a new car listing | 201, 400 |

### Query Parameters for `GET /api/v1/cars`
- `make` (string, optional): Case-insensitive substring search for car make.
- `maxPrice` (double, optional, min: 0): Maximum price threshold.
- `minYear` (integer, optional, min: 1900): Minimum manufacturing year.

### Error Format (RFC 7807 ProblemDetail)
Responses with status 4xx/5xx return `application/problem+json`:
```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Invalid input parameters",
  "instance": "/api/v1/cars",
  "errors": [
    "make is required",
    "year must be greater than or equal to 1900"
  ]
}
```

---

## Getting Started

### Prerequisites
- JDK 21 or later (`java -version`)
- Maven 3.9+ or use the included Maven wrapper (`./mvnw` or `mvnw.cmd`)

### Build and Run Tests
```bash
# In the backend directory:
./mvnw clean test-compile
./mvnw test
```

### Run the Application
```bash
./mvnw spring-boot:run
```
The server starts on port `8080` by default.

### H2 In-Memory Database Console
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:cardb`
- **User Name**: `sa`
- **Password**: *(leave empty)*

Initial seed data is loaded automatically on startup (`Tesla Model 3`, `BMW 330i`, `Audi A4`, `Porsche Taycan`, `Ford Mustang Mach-E`, `Toyota RAV4 Hybrid`, `Volkswagen Golf TDI`, `Volvo XC60 Recharge`).

---

## Sample Requests

### Get All Cars
```bash
curl -X GET http://localhost:8080/api/v1/cars
```

### Filter Cars by Make and Max Price
```bash
curl -X GET "http://localhost:8080/api/v1/cars?make=tesla&maxPrice=50000"
```

### Get Car by ID
```bash
curl -X GET http://localhost:8080/api/v1/cars/1
```

### Create a New Car
```bash
curl -X POST http://localhost:8080/api/v1/cars \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Porsche",
    "model": "911 Carrera",
    "year": 2023,
    "mileage": 5000,
    "price": 115000.00,
    "fuelType": "GASOLINE",
    "imageUrl": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
  }'
```
