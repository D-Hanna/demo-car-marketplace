<#
.SYNOPSIS
    Starts both the Spring Boot backend and React/Vite frontend for the Car Marketplace platform.
.DESCRIPTION
    Checks dependencies, ensures frontend node_modules are installed, and launches
    backend and frontend services in dedicated terminal windows.
#>

$ErrorActionPreference = "Stop"
$RootDir = $PSScriptRoot
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting Car Marketplace Platform (Full-Stack)         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check frontend dependencies
if (-not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Host "[Frontend] node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    Push-Location $FrontendDir
    try {
        npm install
    } finally {
        Pop-Location
    }
}

# 2. Launch Backend in a dedicated window
Write-Host "[Backend] Starting Spring Boot 3 on http://localhost:8080..." -ForegroundColor Green
$BackendCommand = @"
`$host.UI.RawUI.WindowTitle = 'Car Marketplace - Backend (Spring Boot)';
Set-Location '$BackendDir';
Write-Host 'Starting Spring Boot backend...' -ForegroundColor Cyan;
.\mvnw.cmd spring-boot:run;
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCommand

# 3. Launch Frontend in a dedicated window
Write-Host "[Frontend] Starting React / Vite dev server on http://localhost:5173..." -ForegroundColor Magenta
$FrontendCommand = @"
`$host.UI.RawUI.WindowTitle = 'Car Marketplace - Frontend (Vite)';
Set-Location '$FrontendDir';
Write-Host 'Starting Vite frontend dev server...' -ForegroundColor Magenta;
npm run dev;
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendCommand

Write-Host ""
Write-Host "Services launched successfully in separate terminal windows!" -ForegroundColor Green
Write-Host "  - Backend API:    http://localhost:8080/api/v1/cars" -ForegroundColor Yellow
Write-Host "  - H2 Console:     http://localhost:8080/h2-console" -ForegroundColor Yellow
Write-Host "  - Frontend UI:    http://localhost:5173" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
