@echo off
echo ========================================
echo   Starting AI E-Commerce Dev Servers
echo ========================================
echo.

:: Check if dependencies are installed
if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run 'setup.bat' first
    pause
    exit /b 1
)

if not exist backend\node_modules (
    echo ERROR: Backend dependencies not installed!
    echo Please run 'setup.bat' first
    pause
    exit /b 1
)

if not exist frontend\node_modules (
    echo ERROR: Frontend dependencies not installed!
    echo Please run 'setup.bat' first
    pause
    exit /b 1
)

:: Check environment files
if not exist backend\.env (
    echo WARNING: backend\.env not found!
    echo The backend may not work properly without environment variables
    echo.
)

if not exist frontend\.env (
    echo WARNING: frontend\.env not found!
    echo Creating basic frontend environment...
    echo REACT_APP_API_URL=http://localhost:5000 > frontend\.env
    echo.
)

echo ✓ Starting both servers concurrently...
echo ✓ Backend will run on: http://localhost:5000
echo ✓ Frontend will run on: http://localhost:3000
echo ✓ Browser will open automatically
echo.
echo Press Ctrl+C to stop both servers
echo.

:: Start both servers using concurrently
npm run dev