@echo off
echo ========================================
echo   AI E-Commerce MERN Stack Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo.

:: Install root dependencies (concurrently)
echo [1/4] Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

:: Install backend dependencies
echo [2/4] Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

:: Setup backend environment
if not exist .env (
    if exist .env.example (
        echo [3/4] Setting up backend environment...
        copy .env.example .env
        echo ⚠️  Please edit backend\.env with your API keys
    ) else (
        echo ⚠️  No .env.example found in backend
    )
) else (
    echo ✓ Backend .env already exists
)

cd ..

:: Install frontend dependencies
echo [4/4] Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

:: Setup frontend environment
if not exist .env (
    echo Creating frontend .env template...
    echo REACT_APP_API_URL=http://localhost:5000 > .env
    echo REACT_APP_FIREBASE_API_KEY=your_firebase_api_key >> .env
    echo REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com >> .env
    echo REACT_APP_FIREBASE_PROJECT_ID=your_project_id >> .env
    echo ⚠️  Please edit frontend\.env with your Firebase config
) else (
    echo ✓ Frontend .env already exists
)

cd ..

echo.
echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your MongoDB, Firebase, and Razorpay keys
echo 2. Edit frontend\.env with your Firebase configuration
echo 3. Run 'start-dev.bat' to launch both servers
echo.
pause