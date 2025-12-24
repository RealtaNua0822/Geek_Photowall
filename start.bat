@echo off
echo ========================================
echo    Photographer Website Start Script
echo ========================================

echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
ping 127.0.0.1 -n 4 > nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd client & npm start"

echo ========================================
echo    Servers Started!
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause