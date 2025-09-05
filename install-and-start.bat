@echo off
echo Installing all dependencies and starting MERN stack...
echo.

REM Install all dependencies
echo Installing root dependencies...
npm install

echo Installing backend dependencies...
cd backend
npm install

echo Installing frontend dependencies...
cd ../frontend
npm install

cd ..

echo.
echo All dependencies installed successfully!
echo.
echo Starting development servers...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.

REM Start both servers
npm run dev

pause