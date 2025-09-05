@echo off
title AI E-Commerce Quick Start

:: Check if already set up
if exist node_modules if exist backend\node_modules if exist frontend\node_modules (
    echo Dependencies found. Starting development servers...
    call start-dev.bat
) else (
    echo First time setup required...
    call setup.bat
    if %errorlevel% equ 0 (
        echo.
        echo Setup complete! Starting development servers...
        timeout /t 3 /nobreak >nul
        call start-dev.bat
    )
)