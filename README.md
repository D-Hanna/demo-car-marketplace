# Car Marketplace Platform (Proof-of-Concept)

A contract-first full-stack car marketplace application featuring a **Spring Boot 3** backend and a **React + Vite + Tailwind CSS** frontend, built according to the OpenAPI 3.0 specification in [`/specs/car-marketplace-api.yaml`](specs/car-marketplace-api.yaml).

---

## Quick Start (Start Both Frontend & Backend)

Choose the launcher that best fits your environment:

### Option 1: PowerShell (Windows)
```powershell
.\start-dev.ps1
```
*Checks dependencies, installs frontend packages if missing, and launches backend & frontend in dedicated PowerShell windows.*

### Option 2: Windows Batch / Double-Click
Double-click [`start-dev.bat`](start-dev.bat) in File Explorer, or run:
```cmd
start-dev.bat
```

### Option 3: Bash (Git Bash / WSL / Linux / macOS)
```bash
chmod +x start-dev.sh
./start-dev.sh
```
*Runs both in the background in a single terminal with graceful `Ctrl+C` shutdown.*

---

## Endpoints & URLs

- **Frontend Web UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080/api/v1/cars](http://localhost:8080/api/v1/cars)
- **H2 In-Memory Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - **JDBC URL**: `jdbc:h2:mem:cardb`
  - **Username**: `sa`
  - **Password**: *(leave empty)*
- **OpenAPI Specification**: [`specs/car-marketplace-api.yaml`](specs/car-marketplace-api.yaml)

---

## Individual Service Commands

### Backend (`/backend`)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
To run tests:
```powershell
.\mvnw.cmd clean test
```

### Frontend (`/frontend`)
```powershell
cd frontend
npm install
npm run dev
```
To build production bundle:
```powershell
npm run build
```
