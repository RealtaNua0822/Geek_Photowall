@echo off
echo Starting photographer website servers...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000

start "Backend" cmd /k "npm run dev"
ping 127.0.0.1 -n 3 > nul
start "Frontend" cmd /k "cd client & npm start"

echo Both servers are starting...
pause