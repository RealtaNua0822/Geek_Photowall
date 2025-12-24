@echo off
echo ========================================
echo    Photographer Website - Quick Start
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js is installed
echo.

:: Check and install root dependencies
if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Backend dependencies installation failed
        pause
        exit /b 1
    )
    echo [SUCCESS] Backend dependencies installed
) else (
    echo [INFO] Backend dependencies already exist, skipping installation
)

:: Check and install client dependencies
if not exist "client\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd client
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Frontend dependencies installation failed
        cd ..
        pause
        exit /b 1
    )
    echo [SUCCESS] Frontend dependencies installed
    cd ..
) else (
    echo [INFO] Frontend dependencies already exist, skipping installation
)

echo.
echo ========================================
echo    Starting services...
echo ========================================

:: Start backend server
echo [INFO] Starting backend server (port 5000)...
start "Backend Server" cmd /k "echo Backend server is running... && npm run dev"

:: Wait for backend to start
echo [INFO] Waiting for backend server to start...
timeout /t 5 /nobreak >nul

:: Start frontend server
echo [INFO] Starting frontend server (port 3000)...
start "Frontend Server" cmd /k "echo Frontend server is running... && cd client && npm start"

echo.
echo ========================================
echo    Services started successfully!
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo [NOTE] Both server windows will remain open
echo [NOTE] Closing this window will not affect the servers
echo [NOTE] To stop services, close the respective server windows
echo.
pause