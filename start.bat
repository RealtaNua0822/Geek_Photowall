@echo off
chcp 65001 >nul
echo ========================================
echo    摄影师网站 - 一键启动脚本
echo ========================================
echo.

:: 检查 Node.js 是否已安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [信息] Node.js 已安装
echo.

:: 检查并安装根目录依赖
if not exist "node_modules" (
    echo [信息] 正在安装后端依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 后端依赖安装失败
        pause
        exit /b 1
    )
    echo [成功] 后端依赖安装完成
) else (
    echo [信息] 后端依赖已存在，跳过安装
)

:: 检查并安装客户端依赖
if not exist "client\node_modules" (
    echo [信息] 正在安装前端依赖...
    cd client
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 前端依赖安装失败
        cd ..
        pause
        exit /b 1
    )
    echo [成功] 前端依赖安装完成
    cd ..
) else (
    echo [信息] 前端依赖已存在，跳过安装
)

echo.
echo ========================================
echo    正在启动服务...
echo ========================================

:: 启动后端服务器
echo [信息] 启动后端服务器 (端口 5000)...
start "后端服务器" cmd /k "echo 后端服务器运行中... && npm run dev"

:: 等待后端启动
echo [信息] 等待后端服务器启动...
timeout /t 5 /nobreak >nul

:: 检查后端是否启动成功
netstat -an | findstr ":5000" >nul
if %errorlevel% neq 0 (
    echo [警告] 后端服务器可能未正常启动，请检查控制台输出
) else (
    echo [成功] 后端服务器已启动
)

:: 启动前端服务器
echo [信息] 启动前端服务器 (端口 3000)...
start "前端服务器" cmd /k "echo 前端服务器运行中... && cd client && npm start"

:: 等待前端启动
echo [信息] 等待前端服务器启动...
timeout /t 8 /nobreak >nul

:: 检查前端是否启动成功
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo [警告] 前端服务器可能未正常启动，请检查控制台输出
) else (
    echo [成功] 前端服务器已启动
)

echo.
echo ========================================
echo    服务启动完成！
echo ========================================
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:5000
echo.
echo [提示] 两个服务器窗口将保持打开状态
echo [提示] 关闭此窗口不会影响服务器运行
echo [提示] 如需停止服务，请关闭对应的服务器窗口
echo.
echo [提示] 如果页面无法访问，请等待几秒钟让服务完全启动
echo.

:: 可选：自动打开浏览器
echo [信息] 5秒后自动打开浏览器...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo [完成] 启动脚本执行完毕！
pause