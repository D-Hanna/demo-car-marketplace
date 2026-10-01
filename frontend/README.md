# AutoMarket - Car Marketplace Frontend

A modern, responsive, high-performance web application built with **React 18**, **Vite**, and **Tailwind CSS**. This frontend strictly consumes and adheres to the contract defined in [`/specs/car-marketplace-api.yaml`](../specs/car-marketplace-api.yaml).

---

## ✨ Features

- **Contract-First Architecture**: Strictly adheres to the OpenAPI 3.0 specification:
  - `GET /api/v1/cars` with query filtering (`make`, `maxPrice`, `minYear`).
  - `GET /api/v1/cars/{id}` for single vehicle lookups.
  - `POST /api/v1/cars` for listing new vehicles with payload validation.
- **Graceful Fallback & Demo Mode**:
  - Automatically detects whether the Spring Boot backend (`http://localhost:8080`) is active.
  - If the backend is not yet started, falls back to a realistic in-memory/localStorage dataset with a live banner and reconnect trigger, allowing seamless full-stack transition.
- **RFC 7807 `ProblemDetail` Support**:
  - Handles `application/problem+json` error responses gracefully.
  - Displays user-friendly error banners and granular field validation error lists directly in the UI.
- **Modern UI & UX**:
  - **Header/Navbar**: Branding, live connection status badge, and "List a Car" CTA button.
  - **Filter Bar**: Make keyword search, interactive Max Price slider with numeric input, Minimum Year selector, and quick reset action.
  - **Car Cards**: High-resolution image preview, vehicle specs (mileage, year), formatted currency price, and colored powertrain badges (`GASOLINE`, `DIESEL`, `ELECTRIC`, `HYBRID`, `PLUGIN_HYBRID`).
  - **Quick View Modal**: Detailed vehicle inspection overlay with warranties, guarantees, and monthly financing estimation.
  - **Create Listing Modal**: Validated submission form with real-time image URL preview and one-click sample presets.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (Node v24 tested)
- **npm**: v9.0.0 or later

### Installation

From the repository root or the `/frontend` directory:

```bash
cd frontend
npm install
```

### Development Server

Start Vite in development mode with hot-reloading:

```bash
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔌 Backend Integration

Vite is configured with an API proxy in `vite.config.js`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

When the Spring Boot backend is launched at `http://localhost:8080`, all requests to `/api/v1/cars` seamlessly route to the backend. If the backend is stopped or unavailable, the application gracefully operates in **Demo Mode** without crashing.

---

## 📁 Project Structure

```
frontend/
├── index.html                  # Entry HTML
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration for Tailwind
├── tailwind.config.js          # Tailwind CSS styling configuration
├── vite.config.js              # Vite configuration & backend proxy
├── README.md                   # Project documentation
└── src/
    ├── main.jsx                # Application entry point
    ├── App.jsx                 # Main state, filtering & modal orchestration
    ├── index.css               # Tailwind directives & global styling
    ├── api/
    │   └── carApi.js           # OpenAPI client & RFC 7807 problem handler
    └── components/
        ├── Navbar.jsx          # Header with branding & connection badge
        ├── FilterBar.jsx       # Multi-field search & filtering controls
        ├── CarCard.jsx         # Card component with badges & quick view trigger
        ├── CarDetailModal.jsx  # Full car specification modal
        ├── CreateCarModal.jsx  # Car listing creation form with validation
        └── Icons.jsx           # Reusable SVG icon components
```
