# SQL Query Execution Visualizer

A full-stack web application that allows you to write SQL SELECT queries, execute them against a local SQLite database, and see a step-by-step visualization of the logical execution order.

## Technology Stack

- **Frontend**: React
- **Backend**: Python with Flask
- **Database**: SQLite
- **SQL Parser**: sqlparse library

## Features

- Execute SQL SELECT queries against a sample employee database
- Step-by-step visualization of query execution order:
  - FROM/JOIN clause
  - WHERE filtering
  - GROUP BY aggregation
  - SELECT column selection
  - ORDER BY sorting
- View database schema
- Sample queries for quick testing
- Real-time query results display

## Database Schema

### departments
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT)
- `location` (TEXT)

### employees
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT)
- `salary` (INTEGER)
- `department_id` (INTEGER, FOREIGN KEY)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Linux/Mac**:
     ```bash
     source venv/bin/activate
     ```
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will be available at `http://127.0.0.1:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The application will automatically open in your browser at `http://localhost:3000`

## Usage

1. Make sure both the backend and frontend servers are running
2. Open your browser to `http://localhost:3000`
3. View the database schema in the left panel
4. Write or select a sample SQL query in the SQL Editor
5. Click "Run Query" to execute
6. View the step-by-step execution visualization in the right panel
7. See the final query results at the bottom

## Sample Queries

Try these queries to see the visualization in action:

```sql
-- Basic select
SELECT * FROM employees

-- With WHERE clause
SELECT name, salary FROM employees WHERE salary > 80000

-- With JOIN
SELECT e.name, e.salary, d.name as department 
FROM employees e 
JOIN departments d ON e.department_id = d.id

-- With GROUP BY
SELECT d.name, COUNT(*) as emp_count 
FROM employees e 
JOIN departments d ON e.department_id = d.id 
GROUP BY d.name

-- With ORDER BY
SELECT * FROM employees ORDER BY salary DESC
```

## Security Note

This application is designed for **local development only**. The backend only accepts SELECT queries for safety, but should not be exposed to the internet without proper security measures.

## Project Structure

```
sql-visualizer/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── employees.db        # SQLite database
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SchemaViewer.js
│   │   │   ├── SqlEditor.js
│   │   │   ├── Visualization.js
│   │   │   └── ResultsTable.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Troubleshooting

### Backend Issues

- **Error: "Module not found"**: Make sure you've activated the virtual environment and installed all dependencies
- **Database locked**: Close any other connections to the database file
- **Port already in use**: Change the port in `app.py` if 5000 is already in use

### Frontend Issues

- **Cannot connect to backend**: Ensure the Flask server is running on port 5000
- **CORS errors**: The backend has CORS enabled for localhost:3000, but if you change ports, update the CORS configuration in `app.py`

## License

This project is for educational purposes.
