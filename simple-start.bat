@echo off
echo ========================================
echo    摄影师网站启动脚本
echo ========================================
echo.

echo 1. 启动后端服务器...
start "后端服务器 - 端口5000" cmd /k "npm run dev"

echo.
echo 2. 等待后端服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo 3. 启动前端服务器...
start "前端服务器 - 端口3000" cmd /k "cd client && npm start"

echo.
echo ========================================
echo    服务器启动完成！
echo ========================================
echo.
echo 访问地址：
echo 前端网站: http://localhost:3000
echo 后端API:  http://localhost:5000
echo.
echo 提示：
echo - 首次启动可能需要1-2分钟
echo - 如果端口被占用，请关闭相关进程
echo - 按 Ctrl+C 可停止服务器
echo.
pause