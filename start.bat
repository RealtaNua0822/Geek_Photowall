@echo off
echo 启动摄影师网站服务器...
echo.
echo 服务器将运行在: http://localhost:5000
echo 前端开发服务器运行在: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动后端服务器
start "后端服务器" cmd /k "npm run dev"

REM 等待2秒让后端服务器启动
timeout /t 2 /nobreak >nul

REM 启动前端开发服务器
start "前端服务器" cmd /k "cd client && npm start"

echo.
echo 两个服务器正在启动中...
echo 后端: http://localhost:5000
echo 前端: http://localhost:3000
echo.
pause