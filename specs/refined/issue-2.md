# Issue #2: As a user, I want to have a detail page for each car

## User Story
As a user, I want to view a dedicated detail page for each car with complete information, so that I can see all specifications and easily share direct links to individual vehicles.

## Acceptance Criteria
- [ ] Implement client-side routing (e.g., React Router) or dedicated view navigation for individual cars at `/cars/:id`.
- [ ] Fetch vehicle details by ID from the backend API (`GET /api/v1/cars/{id}`).
- [ ] Display full vehicle specifications (make, model, year, price, mileage, fuel type).
- [ ] Provide intuitive back navigation to return to the car listing / marketplace view.
- [ ] Handle loading state and 404 / not found error states gracefully if the car does not exist.

## Architect Agent: Technical Refinement & Architecture Analysis
- **OpenAPI 3.0.3 Contract**: `GET /api/v1/cars/{id}` is fully specified with 200 (schema: Car) and 404 (schema: ProblemDetail).
- **Backend Implementation**: `CarController`, `CarService`, `CarServiceImpl` already implemented and tested.
- **Contract Boundary**: Display official contract fields (`id`, `make`, `model`, `year`, `mileage`, `price`, `fuelType`, `imageUrl`). Overview highlights can provide additional UI details without inventing uncontracted DB schema fields.
- **Routing Strategy**: Install `react-router-dom` in `frontend/`.
- **Routes**:
  - `/` -> `CarListPage.jsx`
  - `/cars/:id` -> `CarDetailPage.jsx`
  - `*` -> `NotFoundPage.jsx`
- **UX States**:
  - Loading State: Skeleton UI matching layout.
  - 404 State: User-friendly vehicle not found with back to home CTA.
  - Success State: Breadcrumbs, hero image, price, technical specifications grid, "Copy Share Link" with feedback toast, "Contact Dealer" CTA.
- **Verification**: Tests passing and `npm run build` succeeds without errors.
