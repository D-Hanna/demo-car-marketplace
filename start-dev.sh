#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "=========================================================="
echo "   Starting Car Marketplace Platform (Full-Stack)         "
echo "=========================================================="

# Check and install frontend dependencies if missing
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "[Frontend] Installing dependencies..."
    (cd "$FRONTEND_DIR" && npm install)
fi

# Cleanup handler on exit or Ctrl+C
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    echo "Services stopped."
}
trap cleanup EXIT INT TERM

echo "[Backend] Starting Spring Boot 3 on port 8080..."
(cd "$BACKEND_DIR" && ./mvnw spring-boot:run) &
BACKEND_PID=$!

echo "[Frontend] Starting Vite on port 5173..."
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo "Both services are running:"
echo "  - Backend API:    http://localhost:8080/api/v1/cars"
echo "  - H2 Console:     http://localhost:8080/h2-console"
echo "  - Frontend UI:    http://localhost:5173"
echo "Press Ctrl+C to stop both services."
echo "=========================================================="
echo ""

wait
