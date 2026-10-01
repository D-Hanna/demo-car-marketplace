@echo off
setlocal
title Starting Car Marketplace Platform

echo ==========================================================
echo    Starting Car Marketplace Platform (Full-Stack)
echo ==========================================================

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

rem Check and install frontend dependencies if missing
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [Frontend] node_modules missing. Installing npm dependencies...
    cd /d "%FRONTEND_DIR%"
    call npm install
)

echo [Backend] Starting Spring Boot 3 on port 8080...
start "Car Marketplace - Backend (Spring Boot)" cmd /k "cd /d "%BACKEND_DIR%" && mvnw.cmd spring-boot:run"

echo [Frontend] Starting Vite dev server on port 5173...
start "Car Marketplace - Frontend (Vite)" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo ==========================================================
echo Both services launched in separate windows!
echo   - Backend API:    http://localhost:8080/api/v1/cars
echo   - H2 Console:     http://localhost:8080/h2-console
echo   - Frontend UI:    http://localhost:5173
echo ==========================================================
echo.
pause
