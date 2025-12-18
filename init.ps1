# Fitness Tracker Development Environment Setup
# PowerShell script for Windows

Write-Host "Starting Fitness Tracker Development Environment" -ForegroundColor Cyan

# Check Node.js version
try {
    $nodeVersion = node -v
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start development server
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Development environment ready!" -ForegroundColor Green
Write-Host "  Server will be available at: http://localhost:5173" -ForegroundColor White
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev
