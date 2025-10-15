#!/bin/bash

# Script to start both backend and frontend servers

echo "Starting SQL Query Visualizer..."
echo ""

# Start backend in background
echo "Starting Flask backend..."
cd backend
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
pip install -q -r requirements.txt
python app.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "SQL Query Visualizer is starting..."
echo "Backend: http://127.0.0.1:5000"
echo "Frontend: http://localhost:3000"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
