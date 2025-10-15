@echo off
echo Starting SQL Query Visualizer...
echo.

echo Starting Flask backend...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -q -r requirements.txt
start /B python app.py
cd ..

timeout /t 3 /nobreak >nul

echo Starting React frontend...
cd frontend
start /B npm start
cd ..

echo.
echo ============================================
echo SQL Query Visualizer is starting...
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:3000
echo ============================================
echo.
echo Press Ctrl+C to stop (you may need to close manually)
pause
